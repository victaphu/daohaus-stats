import { BigInt, log, Address, EthereumBlock } from "@graphprotocol/graph-ts";
import {
  V1Moloch as Contract,
  SummonComplete,
  ProcessProposal,
  Ragequit,
  SubmitProposal,
  SubmitVote,
} from "../generated/templates/MolochV1Template/V1Moloch";
import { Erc20 as Token } from "../generated/templates/MolochV1Template/Erc20";
import { Guildbank } from "../generated/templates/MolochV1Template/Guildbank";
import { Moloch, Balance } from "../generated/schema";
import {
  addVotedBadge,
  addSummonBadge,
  addRageQuitBadge,
  addProposalSubmissionBadge,
  addMembershipBadge,
  addProposalProcessorBadge,
} from "./badges";

function addBalance(
  daoAddress: Address,
  block: EthereumBlock,
  direction: string,
  action: string,
  amount: BigInt = BigInt.fromI32(0)
): void {
  let contract = Contract.bind(daoAddress);
  let guildBankAddress = contract.guildBank();
  let guildBank = Guildbank.bind(guildBankAddress);
  let tokenAddress = guildBank.approvedToken();
  let token = Token.bind(tokenAddress);

  let balanceId = daoAddress
    .toHex()
    .concat("-")
    .concat(block.number.toString())
    .concat("-")
    .concat(tokenAddress.toHexString());
  let balance = new Balance(balanceId);

  let balanceValue = token.try_balanceOf(guildBankAddress);
  if (balanceValue.reverted) {
    log.info(
      "balanceOf reverted daoAddress {}, tokenAddress, {}, guildBank, {}",
      [
        daoAddress.toHexString(),
        tokenAddress.toHexString(),
        guildBankAddress.toHexString(),
      ]
    );
    balance.balance = BigInt.fromI32(0);
  } else {
    balance.balance = balanceValue.value;
  }

  let totalShares = contract.try_totalShares();
  let shares = BigInt.fromI32(0);
  if (totalShares.reverted) {
    log.info("totalShares reverted daoAddress {}", [daoAddress.toHexString()]);
  } else {
    shares = totalShares.value;
  }

  balance.timestamp = block.timestamp.toString();
  balance.tokenAddress = tokenAddress;
  balance.molochAddress = daoAddress;
  balance.moloch = daoAddress.toHex();
  balance.payment = direction == "payment";
  balance.tribute = direction == "tribute";
  balance.action = action;

  balance.amount = amount;
  if (action == "rageQuit") {
    if (shares == BigInt.fromI32(0)) {
      balance.amount = BigInt.fromI32(0);
      balance.rageQuitAllShares = true;
    } else {
      let shareValue = balance.balance.div(shares as BigInt);
      balance.amount = amount.times(shareValue);

      log.info("rageQuit shareValue, shares, amount {}, {}, {}", [
        shareValue.toString(),
        amount.toString(),
        balance.amount.toString(),
      ]);
    }
  }

  balance.version = "1";
  balance.save();
}

export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.address.toHex();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let contract = Contract.bind(event.address);
  let guildBankAddress = contract.guildBank();
  moloch.summoningTime = contract.summoningTime();
  moloch.guildBankAddress = guildBankAddress;
  moloch.save();

  addBalance(event.address, event.block, "initial", "summon");
  addSummonBadge(event.params.summoner, event.transaction);
  addMembershipBadge(event.params.summoner);
}

export function handleSubmitProposal(event: SubmitProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  moloch.proposalCount = moloch.proposalCount.plus(BigInt.fromI32(1));

  moloch.save();

  addProposalSubmissionBadge(event.params.memberAddress, event.transaction);
}

export function handleSubmitVote(event: SubmitVote): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  moloch.voteCount = moloch.voteCount.plus(BigInt.fromI32(1));

  moloch.save();

  addVotedBadge(
    event.params.memberAddress,
    event.params.uintVote,
    event.transaction
  );
}

export function handleProcessProposal(event: ProcessProposal): void {
  if (event.params.didPass) {
    addBalance(
      event.address,
      event.block,
      "tribute",
      "processProposal",
      event.params.tokenTribute
    );
  }

  addProposalProcessorBadge(event.transaction.from, event.transaction);

  // todo - we can't tell if this is a newMember proposal
  // addMembershipBadge(event.params.applicant);
}

export function handleRagequit(event: Ragequit): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  moloch.rageQuitCount = moloch.rageQuitCount.plus(BigInt.fromI32(1));

  moloch.save();

  addBalance(
    event.address,
    event.block,
    "payment",
    "rageQuit",
    event.params.sharesToBurn
  );

  addRageQuitBadge(event.params.memberAddress, event.transaction);
}

export function handleSummonCompleteLegacy(event: SummonComplete): void {
  let molochId = event.address.toHex();
  let moloch = new Moloch(molochId);

  let title =
    event.address.toHex() == "0x1fd169a4f5c59acf79d0fd5d91d1201ef1bce9f1"
      ? "Moloch DAO"
      : "MetaCartel DAO";
  moloch.title = title;

  moloch.newContract = "1";
  moloch.version = "1";
  moloch.deleted = false;
  moloch.summoner = event.params.summoner;
  moloch.timestamp = event.block.timestamp.toString();
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.memberCount = BigInt.fromI32(0);
  moloch.voteCount = BigInt.fromI32(0);
  moloch.rageQuitCount = BigInt.fromI32(0);

  let contract = Contract.bind(event.address);
  moloch.summoningTime = contract.summoningTime();
  moloch.guildBankAddress = contract.guildBank();

  moloch.save();

  addMembershipBadge(event.params.summoner);
  addSummonBadge(event.params.summoner, event.transaction);
}
