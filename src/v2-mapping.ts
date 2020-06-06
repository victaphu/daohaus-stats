import {
  BigInt,
  log,
  Address,
  Bytes,
  EthereumBlock,
} from "@graphprotocol/graph-ts";
import {
  V2Moloch as Contract,
  SummonComplete,
  ProcessProposal,
  ProcessWhitelistProposal,
  ProcessGuildKickProposal,
  Ragequit,
  Withdraw,
  TokensCollected,
  SubmitProposal,
  SubmitVote,
} from "../generated/templates/MolochV2Template/V2Moloch";
import { Moloch, Balance, ProposalDetail } from "../generated/schema";

let GUILD = Address.fromString("0x000000000000000000000000000000000000beef");

function getBalance(daoAddress: Address, tokenAddress: Bytes): BigInt {
  let contract = Contract.bind(daoAddress);
  let balance = BigInt.fromI32(0);
  let balanceValue = contract.try_getUserTokenBalance(
    GUILD,
    tokenAddress as Address
  );
  if (balanceValue.reverted) {
    log.info(
      "balanceOf reverted v2 guildbank daoAddress {}, tokenAddress, {}",
      [daoAddress.toHexString(), tokenAddress.toHexString()]
    );
  } else {
    balance = balanceValue.value;
  }

  return balance;
}

function addBalance(
  daoAddress: Address,
  block: EthereumBlock,
  amount: BigInt,
  tokenAddress: Bytes,
  direction: string,
  action: string
): void {
  // let contract = Contract.bind(daoAddress);
  let balanceId = daoAddress
    .toHex()
    .concat("-")
    .concat(block.number.toString())
    .concat("-")
    .concat(tokenAddress.toHexString());
  let balance = new Balance(balanceId);

  // let balanceValue = contract.try_getUserTokenBalance(
  //   GUILD,
  //   tokenAddress as Address
  // );
  // if (balanceValue.reverted) {
  //   log.info(
  //     "balanceOf reverted v2 guildbank daoAddress {}, tokenAddress, {}",
  //     [daoAddress.toHexString(), tokenAddress.toHexString()]
  //   );
  //   balance.balance = BigInt.fromI32(0);
  // } else {
  //   balance.balance = balanceValue.value;
  // }

  balance.balance = getBalance(daoAddress, tokenAddress);

  balance.timestamp = block.timestamp.toString();
  balance.tokenAddress = tokenAddress;
  balance.molochAddress = daoAddress;
  balance.moloch = daoAddress.toHex();
  balance.payment = direction == "payment";
  balance.tribute = direction == "tribute";
  balance.action = action;
  balance.amount = amount;

  balance.version = "2";
  balance.save();

  log.info("saved balance amount {}, action, {}, ", [
    balance.amount.toString(),
    action,
  ]);
}

export function handleSubmitProposal(event: SubmitProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.proposalCount = moloch.proposalCount.plus(BigInt.fromI32(1));

  moloch.save();

  // cache some proposal data for use in processProposal
  let newProposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());

  let proposal = new ProposalDetail(newProposalId);
  proposal.proposalId = event.params.proposalId;

  proposal.moloch = molochId;
  proposal.molochAddress = event.address;
  proposal.createdAt = event.block.timestamp.toString();
  proposal.tributeOffered = event.params.tributeOffered;
  proposal.tributeToken = event.params.tributeToken;
  proposal.paymentRequested = event.params.paymentRequested;
  proposal.paymentToken = event.params.paymentToken;

  proposal.save();
}

export function handleProcessProposal(event: ProcessProposal): void {
  let molochId = event.address.toHexString();
  let processProposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = ProposalDetail.load(processProposalId);

  if (event.params.didPass) {
    if (proposal.tributeOffered > BigInt.fromI32(0)) {
      addBalance(
        event.address,
        event.block,
        proposal.tributeOffered,
        proposal.tributeToken,
        "tribute",
        "processProposal"
      );
    }

    if (proposal.paymentRequested > BigInt.fromI32(0)) {
      addBalance(
        event.address,
        event.block,
        proposal.paymentRequested,
        proposal.paymentToken,
        "payment",
        "processProposal"
      );
    }
  }
}

export function handleSubmitVote(event: SubmitVote): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.voteCount = moloch.voteCount.plus(BigInt.fromI32(1));

  moloch.save();
}

export function handleRagequit(event: Ragequit): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.rageQuitCount = moloch.rageQuitCount.plus(BigInt.fromI32(1));

  moloch.save();

  let contract = Contract.bind(event.address);

  let sharesAndLootToBurn = event.params.sharesToBurn.plus(
    event.params.lootToBurn
  );
  let currentTotalShares = contract.totalShares();
  let currentTotalLoot = contract.totalLoot();
  let currentTotalSharesAndLoot = currentTotalShares.plus(currentTotalLoot);
  let initialTotalSharesAndLoot = currentTotalSharesAndLoot.plus(
    sharesAndLootToBurn
  );

  let tokenCount = contract.getTokenCount();

  // for (
  //   let i = BigInt.fromI32(0);
  //   i < tokenCount;
  //   i = i.plus(BigInt.fromI32(1))
  // ) {
  //   let token = contract.approvedTokens(BigInt.fromI32(i));
  // }

  for (let i = 0; i < tokenCount.toI32(); i++) {
    let token = contract.approvedTokens(BigInt.fromI32(i));
    let tokenBalance = getBalance(event.address, token);

    // only if balance > 0
    if (tokenBalance > BigInt.fromI32(0)) {
      let balanceTimesBurn = tokenBalance.times(sharesAndLootToBurn);
      let amountToRageQuit = balanceTimesBurn.div(initialTotalSharesAndLoot);

      addBalance(
        event.address,
        event.block,
        amountToRageQuit,
        token,
        "payment",
        "rageQuit"
      );
    }
  }
}

export function handleTokensCollected(event: TokensCollected): void {
  addBalance(
    event.address,
    event.block,
    event.params.amountToCollect,
    event.params.token,
    "tribute",
    "tokensCollected"
  );
}

export function handleSummonCompleteLegacy(event: SummonComplete): void {
  let molochId = event.address.toHex();
  let moloch = new Moloch(molochId);
  moloch.title = "MetaCartel Ventures";
  moloch.version = "2";
  moloch.deleted = false;
  moloch.newContract = "1";
  moloch.timestamp = event.block.timestamp.toString();
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.memberCount = BigInt.fromI32(0);
  moloch.voteCount = BigInt.fromI32(0);
  moloch.rageQuitCount = BigInt.fromI32(0);
  moloch.summoner = event.params.summoner;
  moloch.summoningTime = event.params.summoningTime;

  moloch.save();
}
