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
  SponsorProposal,
  TokensCollected,
  SubmitProposal,
  SubmitVote,
  Withdraw,
} from "../generated/templates/MolochV2Template/V2Moloch";
import { Erc20 } from "../generated/templates/MolochV2Template/Erc20";
import { Erc20Bytes32 } from "../generated/templates/MolochV2Template/Erc20Bytes32";
import { Moloch, Balance, ProposalDetail, DaoMeta } from "../generated/schema";
import {
  addVotedBadge,
  addSummonBadge,
  addRageQuitBadge,
  addJailedCountBadge,
  addProposalSubmissionBadge,
  addProposalSponsorBadge,
  addMembershipBadge,
  addProposalProcessorBadge,
  addGas,
} from "./badges";

let GUILD = Address.fromString("0x000000000000000000000000000000000000dead");

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

function getShares(daoAddress: Address): BigInt {
  let contract = Contract.bind(daoAddress);
  let shares = BigInt.fromI32(0);
  let sharesValue = contract.try_totalShares();
  if (sharesValue.reverted) {
    log.info("totalShares reverted daoAddress, {}", [daoAddress.toHexString()]);
  } else {
    shares = sharesValue.value;
  }

  return shares;
}

function getLoot(daoAddress: Address): BigInt {
  let contract = Contract.bind(daoAddress);
  let loot = BigInt.fromI32(0);
  let lootValue = contract.try_totalLoot();
  if (lootValue.reverted) {
    log.info("totalLoot reverted daoAddress, {}", [daoAddress.toHexString()]);
  } else {
    loot = lootValue.value;
  }

  return loot;
}

function addBalance(
  daoAddress: Address,
  block: EthereumBlock,
  amount: BigInt,
  tokenAddress: Bytes,
  direction: string,
  action: string
): void {
  let balanceId = daoAddress
    .toHex()
    .concat("-")
    .concat(block.number.toString())
    .concat("-")
    .concat(tokenAddress.toHexString());
  let balance = new Balance(balanceId);

  balance.balance = getBalance(daoAddress, tokenAddress);
  balance.currentShares = getShares(daoAddress);
  balance.currentLoot = getLoot(daoAddress);

  balance.timestamp = block.timestamp.toString();
  balance.tokenAddress = tokenAddress;
  balance.molochAddress = daoAddress;
  balance.moloch = daoAddress.toHex();
  balance.payment = direction == "payment";
  balance.tribute = direction == "tribute";
  balance.action = action;
  balance.amount = amount;
  balance.tokenSymbol = getTokenSymbol(tokenAddress);
  balance.tokenDecimals = getTokenDecimals(tokenAddress);
  balance.version = "2";
  balance.save();

  log.info("saved balance amount {}, action, {}, ", [
    balance.amount.toString(),
    action,
  ]);
}

export function getTokenSymbol(token: Bytes): string {
  let erc20 = Erc20.bind(token as Address);
  let symbol = erc20.try_symbol();
  if (symbol.reverted) {
    let erc20Bytes32 = Erc20Bytes32.bind(token as Address);
    let otherSymbol = erc20Bytes32.try_symbol();
    if (otherSymbol.reverted) {
      log.info("other symbol reverted token, {}", [token.toHexString()]);
      return "wtf";
    } else {
      return otherSymbol.value.toString();
    }
  } else {
    return symbol.value.toString();
  }
}

export function getTokenDecimals(token: Bytes): BigInt {
  let erc20 = Erc20.bind(token as Address);
  let decimals = erc20.try_decimals();
  if (decimals.reverted) {
    log.info("decimals reverted token, {}", [token.toHexString()]);
    return BigInt.fromI32(0);
  } else {
    return BigInt.fromI32(decimals.value);
  }
}

//legacy daos will trigger this, factory daos get created in factory-mapping.ts
export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.address.toHex();
  let moloch = new Moloch(molochId);
  let daoMeta = DaoMeta.load(molochId);

  moloch.timestamp = event.block.timestamp.toString();
  moloch.summoner = event.params.summoner;
  moloch.summoningTime = event.params.summoningTime;
  moloch.title = daoMeta.title;
  moloch.version = daoMeta.version;
  moloch.newContract = daoMeta.newContract;
  moloch.deleted = false;
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.memberCount = BigInt.fromI32(0);
  moloch.voteCount = BigInt.fromI32(0);
  moloch.rageQuitCount = BigInt.fromI32(0);
  moloch.totalGas = addGas(BigInt.fromI32(0), event.transaction);

  moloch.save();

  addSummonBadge(event.params.summoner, event.transaction);
  addMembershipBadge(event.params.summoner);
}

export function handleSubmitProposal(event: SubmitProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  log.info("***handleSubmitProposal, {}", [molochId]);

  moloch.proposalCount = moloch.proposalCount.plus(BigInt.fromI32(1));
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
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
  proposal.applicant = event.params.applicant;
  proposal.tributeOffered = event.params.tributeOffered;
  proposal.tributeToken = event.params.tributeToken;
  proposal.paymentRequested = event.params.paymentRequested;
  proposal.paymentToken = event.params.paymentToken;

  proposal.save();

  addProposalSubmissionBadge(event.transaction.from, event.transaction);
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

  addProposalProcessorBadge(event.transaction.from, event.transaction);

  let moloch = Moloch.load(molochId);
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();
  // todo - we can't tell if this is a newMember proposal
  // addMembershipBadge(proposal.applicant);
}

export function handleProcessWhitelistProposal(
  event: ProcessWhitelistProposal
): void {
  addProposalProcessorBadge(event.transaction.from, event.transaction);

  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();
}

export function handleProcessGuildKickProposal(
  event: ProcessGuildKickProposal
): void {
  addProposalProcessorBadge(event.transaction.from, event.transaction);

  let molochId = event.address.toHexString();
  let processProposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = ProposalDetail.load(processProposalId);

  if (event.params.didPass) {
    addJailedCountBadge(proposal.applicant, event.transaction);
  }

  let moloch = Moloch.load(molochId);
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();
}

export function handleSubmitVote(event: SubmitVote): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.voteCount = moloch.voteCount.plus(BigInt.fromI32(1));
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();

  addVotedBadge(
    event.params.memberAddress,
    event.params.uintVote,
    event.transaction
  );
}

export function handleSponsorProposal(event: SponsorProposal): void {
  addProposalSponsorBadge(event.params.memberAddress, event.transaction);

  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();
}

export function handleRagequit(event: Ragequit): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.rageQuitCount = moloch.rageQuitCount.plus(BigInt.fromI32(1));
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
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

  addRageQuitBadge(event.params.memberAddress, event.transaction);
}

export function handleWithdraw(event: Withdraw): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.rageQuitCount = moloch.rageQuitCount.plus(BigInt.fromI32(1));
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();
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

  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.rageQuitCount = moloch.rageQuitCount.plus(BigInt.fromI32(1));
  moloch.totalGas = addGas(moloch.totalGas, event.transaction);
  moloch.save();
}
