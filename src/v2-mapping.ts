import { BigInt, log, Address, Bytes } from "@graphprotocol/graph-ts";
import {
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
import { Moloch, Balance } from "../generated/schema";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
let ESCROW = Address.fromString("0x000000000000000000000000000000000000dead");
let GUILD = Address.fromString("0x000000000000000000000000000000000000beef");

export function handleSubmitProposal(event: SubmitProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.proposalCount = moloch.proposalCount.plus(BigInt.fromI32(1));

  moloch.save();
}

export function handleProcessProposal(event: ProcessProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  // let processProposalId = molochId
  //   .concat("-proposal-")
  //   .concat(event.params.proposalId.toString());
  // let proposal = Proposal.load(processProposalId);

  // let applicantId = molochId
  //   .concat("-member-")
  //   .concat(proposal.applicant.toHex());
  // let member = Member.load(applicantId);

  // let tributeTokenId = molochId
  //   .concat("-token-")
  //   .concat(proposal.tributeToken.toHex());
  // let paymentTokenId = molochId
  //   .concat("-token-")
  //   .concat(proposal.paymentToken.toHex());

  // let isNewMember = member != null && member.exists == true ? false : true;

  // addProposalProcessorBadge(event.transaction.from, event.transaction);

  // //NOTE: PROPOSAL PASSED
  // if (event.params.didPass) {
  //   proposal.didPass = true;

  //   //CREATE MEMBER
  //   if (isNewMember) {
  //     // if member.exists == false the member entity already exists
  //     // because it was created in cancelProposal for a cancelled new member proposal
  //     let newMember = member;

  //     if (newMember == null) {
  //       newMember = new Member(applicantId);
  //     }

  //     newMember.moloch = molochId;
  //     newMember.createdAt = event.block.timestamp.toString();
  //     newMember.molochAddress = event.address;
  //     newMember.memberAddress = proposal.applicant;
  //     newMember.delegateKey = proposal.applicant;
  //     newMember.shares = proposal.sharesRequested;
  //     newMember.loot = proposal.lootRequested;

  //     if (proposal.sharesRequested > BigInt.fromI32(0)) {
  //       newMember.exists = true;
  //     } else {
  //       newMember.exists = false;
  //     }

  //     newMember.tokenTribute = BigInt.fromI32(0);
  //     newMember.didRagequit = false;
  //     newMember.proposedToKick = false;
  //     newMember.kicked = false;

  //     newMember.save();

  //     addMembershipBadge(proposal.applicant);

  //     //FUND PROPOSAL
  //   } else {
  //     member.shares = member.shares.plus(proposal.sharesRequested);
  //     member.loot = member.loot.plus(proposal.lootRequested);
  //     member.save();
  //   }

  //   //NOTE: Add shares/loot do intake tribute from escrow, payout from guild bank
  //   moloch.totalShares = moloch.totalShares.plus(proposal.sharesRequested);
  //   moloch.totalLoot = moloch.totalLoot.plus(proposal.lootRequested);
  //   internalTransfer(
  //     molochId,
  //     ESCROW,
  //     GUILD,
  //     tributeTokenId,
  //     proposal.tributeOffered
  //   );
  //   //NOTE: check if user has a tokenBalance for that token if not then create one before sending
  //   internalTransfer(
  //     molochId,
  //     GUILD,
  //     proposal.applicant,
  //     paymentTokenId,
  //     proposal.paymentRequested
  //   );

  //   //NOTE: PROPOSAL FAILED
  // } else {
  //   proposal.didPass = false;
  //   // return all tokens to the applicant

  //   // create a member entity if needed for withdraw
  //   if (isNewMember) {
  //     let newMember = new Member(applicantId);

  //     newMember.moloch = molochId;
  //     newMember.createdAt = event.block.timestamp.toString();
  //     newMember.molochAddress = event.address;
  //     newMember.memberAddress = proposal.applicant;
  //     newMember.delegateKey = proposal.applicant;
  //     newMember.shares = BigInt.fromI32(0);
  //     newMember.loot = BigInt.fromI32(0);
  //     newMember.exists = false;
  //     newMember.tokenTribute = BigInt.fromI32(0);
  //     newMember.didRagequit = false;
  //     newMember.proposedToKick = false;
  //     newMember.kicked = false;

  //     newMember.save();
  //   }

  //   internalTransfer(
  //     molochId,
  //     ESCROW,
  //     proposal.applicant,
  //     tributeTokenId,
  //     proposal.tributeOffered
  //   );
  // }

  // //NOTE: fixed array comprehensions update ongoing proposals (that have been sponsored)
  // if (proposal.trade) {
  //   moloch.proposedToTrade = moloch.proposedToTrade.filter(function(
  //     value,
  //     index,
  //     arr
  //   ) {
  //     return index > 0;
  //   });
  // } else if (proposal.newMember) {
  //   moloch.proposedToJoin = moloch.proposedToJoin.filter(function(
  //     value,
  //     index,
  //     arr
  //   ) {
  //     return index > 0;
  //   });
  // } else {
  //   moloch.proposedToFund = moloch.proposedToFund.filter(function(
  //     value,
  //     index,
  //     arr
  //   ) {
  //     return index > 0;
  //   });
  // }
  // proposal.processed = true;

  // internalTransfer(
  //   molochId,
  //   ESCROW,
  //   event.transaction.from,
  //   moloch.depositToken,
  //   moloch.processingReward
  // );
  // internalTransfer(
  //   molochId,
  //   ESCROW,
  //   proposal.sponsor,
  //   moloch.depositToken,
  //   moloch.proposalDeposit.minus(moloch.processingReward)
  // );

  // moloch.save();
  // proposal.save();
}

export function handleProcessWhitelistProposal(
  event: ProcessWhitelistProposal
): void {
  // let molochId = event.address.toHexString();
  // let moloch = Moloch.load(molochId);
  // let processProposalId = molochId
  //   .concat("-proposal-")
  //   .concat(event.params.proposalId.toString());
  // let proposal = Proposal.load(processProposalId);
  // let tokenId = molochId
  //   .concat("-token-")
  //   .concat(proposal.tributeToken.toHex());
  // let token = Token.load(tokenId);
  // let isNotWhitelisted =
  //   token != null && token.whitelisted == true ? false : true;
  // addProposalProcessorBadge(event.transaction.from, event.transaction);
  // //NOTE: PROPOSAL PASSED
  // if (event.params.didPass) {
  //   proposal.didPass = true;
  //   //CREATE Token
  //   //NOTE: invariant no loot no shares,
  //   if (isNotWhitelisted) {
  //     createAndApproveToken(molochId, proposal.tributeToken);
  //     createEscrowTokenBalance(molochId, proposal.tributeToken);
  //     createGuildTokenBalance(molochId, proposal.tributeToken);
  //   }
  //   //NOTE: PROPOSAL FAILED
  // } else {
  //   proposal.didPass = false;
  // }
  // //NOTE: can only process proposals in order.
  // moloch.proposedToWhitelist = moloch.proposedToWhitelist.filter(function(
  //   value,
  //   index,
  //   arr
  // ) {
  //   return index > 0;
  // });
  // proposal.processed = true;
  // //NOTE: issue processing reward and return deposit
  // internalTransfer(
  //   molochId,
  //   ESCROW,
  //   event.transaction.from,
  //   moloch.depositToken,
  //   moloch.processingReward
  // );
  // internalTransfer(
  //   molochId,
  //   ESCROW,
  //   proposal.sponsor,
  //   moloch.depositToken,
  //   moloch.proposalDeposit.minus(moloch.processingReward)
  // );
  // moloch.save();
  // proposal.save();
}

export function handleProcessGuildKickProposal(
  event: ProcessGuildKickProposal
): void {
  // let molochId = event.address.toHexString();
  // let moloch = Moloch.load(molochId);
  // let processProposalId = molochId
  //   .concat("-proposal-")
  //   .concat(event.params.proposalId.toString());
  // let proposal = Proposal.load(processProposalId);
  // addProposalProcessorBadge(event.transaction.from, event.transaction);
  // //PROPOSAL PASSED
  // //NOTE: invariant no loot no shares,
  // if (event.params.didPass) {
  //   proposal.didPass = true;
  //   //Kick member
  //   if (proposal.guildkick) {
  //     let memberId = molochId
  //       .concat("-member-")
  //       .concat(proposal.applicant.toHexString());
  //     let member = Member.load(memberId);
  //     let newLoot = member.shares;
  //     member.jailed = processProposalId;
  //     member.kicked = true;
  //     member.shares = BigInt.fromI32(0);
  //     member.loot = member.loot.plus(newLoot);
  //     moloch.totalLoot = moloch.totalLoot.plus(newLoot);
  //     moloch.totalShares = moloch.totalShares.minus(newLoot);
  //     member.save();
  //     addJailedCountBadge(proposal.applicant, event.transaction);
  //   }
  //   //PROPOSAL FAILED
  // } else {
  //   proposal.didPass = false;
  // }
  // //NOTE: can only process proposals in order, test shift array comprehension might have tp sprt first for this to work
  // moloch.proposedToKick = moloch.proposedToKick.filter(function(
  //   value,
  //   index,
  //   arr
  // ) {
  //   return index > 0;
  // });
  // proposal.processed = true;
  // //NOTE: issue processing reward and return deposit
  // //TODO: fix to not use from address, could be a delegate emit member kwy from event
  // internalTransfer(
  //   molochId,
  //   ESCROW,
  //   event.transaction.from,
  //   moloch.depositToken,
  //   moloch.processingReward
  // );
  // internalTransfer(
  //   molochId,
  //   ESCROW,
  //   proposal.sponsor,
  //   moloch.depositToken,
  //   moloch.proposalDeposit.minus(moloch.processingReward)
  // );
  // moloch.save();
  // proposal.save();
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

  // let molochId = event.address.toHexString();
  // let moloch = Moloch.load(molochId);
  // let memberId = molochId
  //   .concat("-member-")
  //   .concat(event.params.memberAddress.toHex());
  // let member = Member.load(memberId);
  // let sharesAndLootToBurn = event.params.sharesToBurn.plus(
  //   event.params.lootToBurn
  // );
  // let initialTotalSharesAndLoot = moloch.totalShares.plus(moloch.totalLoot);
  // member.shares = member.shares.minus(event.params.sharesToBurn);
  // member.loot = member.loot.minus(event.params.lootToBurn);
  // moloch.totalShares = moloch.totalShares.minus(event.params.sharesToBurn);
  // moloch.totalLoot = moloch.totalLoot.minus(event.params.lootToBurn);
  // // set to doesn't exist if no shares?
  // if (member.shares.equals(new BigInt(0))) {
  //   member.exists = false;
  // }
  // // for each approved token, calculate the fairshare value and transfer from guildbank to user
  // let tokens = moloch.approvedTokens;
  // for (let i = 0; i < tokens.length; i++) {
  //   let token: string = tokens[i];
  //   let balance: TokenBalance | null = loadOrCreateTokenBalance(
  //     molochId,
  //     GUILD,
  //     token
  //   );
  //   let balanceTimesBurn = balance.tokenBalance.times(sharesAndLootToBurn);
  //   let amountToRageQuit = balanceTimesBurn.div(initialTotalSharesAndLoot);
  //   internalTransfer(
  //     molochId,
  //     GUILD,
  //     member.memberAddress,
  //     token,
  //     amountToRageQuit
  //   );
  // }
  // addRageQuitBadge(event.params.memberAddress, event.transaction);
  // member.save();
  // moloch.save();
}

export function handleWithdraw(event: Withdraw): void {
  // // let memberAddress = event.params.memberAddress;
  // log.info(
  //   "***********handleWithdraw tx {}, ammount, {}, from {}, memberAddress {}",
  //   [
  //     event.transaction.hash.toHex(),
  //     event.params.amount.toString(),
  //     event.transaction.from.toHex(),
  //     event.params.memberAddress.toHex(),
  //   ]
  // );
  // // if (
  // //   event.transaction.hash.toHexString() ==
  // //   "0x66372e97bcbcfae9810165f6a49479cacc04fd6a0f8054a9873cd90f766385e7"
  // // ) {
  // //   // NOTE: Used event.transaction.from instead of event.params.memberAddress
  // //   // due to event on MCV where those didn't match and caused subtractFromBalance to fail
  // //   log.info("FIND ME MCV bad tx", []);
  // //   memberAddress = event.transaction.from;
  // // }
  // let molochId = event.address.toHexString();
  // let tokenId = molochId.concat("-token-").concat(event.params.token.toHex());
  // if (event.params.amount > BigInt.fromI32(0)) {
  //   subtractFromBalance(
  //     molochId,
  //     event.params.memberAddress,
  //     tokenId,
  //     event.params.amount
  //   );
  // }
}

export function handleTokensCollected(event: TokensCollected): void {
  // let molochId = event.address.toHexString();
  // let tokenId = molochId.concat("-token-").concat(event.params.token.toHex());
  // addToBalance(molochId, GUILD, tokenId, event.params.amountToCollect);
}

export function handleSummonCompleteLegacy(event: SummonComplete): void {
  // let molochId = event.address.toHex();
  // let moloch = new Moloch(molochId);
  // moloch.title = "MetaCartel Ventures";
  // moloch.version = "2";
  // moloch.deleted = false;
  // moloch.newContract = "1";
  // let tokens = event.params.tokens;
  // let approvedTokens: string[] = [];
  // let escrowTokenBalance: string[] = [];
  // let guildTokenBalance: string[] = [];
  // for (let i = 0; i < tokens.length; i++) {
  //   let token = tokens[i];
  //   approvedTokens.push(createAndApproveToken(molochId, token));
  //   escrowTokenBalance.push(createEscrowTokenBalance(molochId, token));
  //   guildTokenBalance.push(createGuildTokenBalance(molochId, token));
  // }
  // // Start new Moloch instance
  // moloch.summoner = event.params.summoner;
  // moloch.summoningTime = event.params.summoningTime;
  // moloch.periodDuration = event.params.periodDuration;
  // moloch.votingPeriodLength = event.params.votingPeriodLength;
  // moloch.gracePeriodLength = event.params.gracePeriodLength;
  // moloch.proposalDeposit = event.params.proposalDeposit;
  // moloch.dilutionBound = event.params.dilutionBound;
  // moloch.processingReward = event.params.processingReward;
  // moloch.depositToken = approvedTokens[0];
  // moloch.approvedTokens = approvedTokens;
  // moloch.guildTokenBalance = guildTokenBalance;
  // moloch.escrowTokenBalance = escrowTokenBalance;
  // moloch.totalShares = BigInt.fromI32(1);
  // moloch.totalLoot = BigInt.fromI32(0);
  // moloch.proposalCount = BigInt.fromI32(0);
  // moloch.proposalQueueCount = BigInt.fromI32(0);
  // moloch.proposedToJoin = new Array<string>();
  // moloch.proposedToWhitelist = new Array<string>();
  // moloch.proposedToKick = new Array<string>();
  // moloch.proposedToFund = new Array<string>();
  // moloch.proposedToTrade = new Array<string>();
  // moloch.save();
  // addSummonBadge(event.params.summoner, event.transaction);
  // //Create member for summoner
  // let memberId = molochId
  //   .concat("-member-")
  //   .concat(event.params.summoner.toHex());
  // let newMember = new Member(memberId);
  // newMember.moloch = molochId;
  // newMember.createdAt = event.block.timestamp.toString();
  // newMember.molochAddress = event.address;
  // newMember.memberAddress = event.params.summoner;
  // newMember.delegateKey = event.params.summoner;
  // newMember.shares = BigInt.fromI32(1);
  // newMember.loot = BigInt.fromI32(0);
  // newMember.exists = true;
  // newMember.tokenTribute = BigInt.fromI32(0);
  // newMember.didRagequit = false;
  // newMember.proposedToKick = false;
  // newMember.kicked = false;
  // newMember.save();
  // addMembershipBadge(event.params.summoner);
  // //Set summoner summoner balances for approved tokens to zero
  // for (let i = 0; i < tokens.length; i++) {
  //   let token = tokens[i];
  //   let tokenId = molochId.concat("-token-").concat(token.toHex());
  //   createMemberTokenBalance(
  //     molochId,
  //     event.params.summoner,
  //     tokenId,
  //     BigInt.fromI32(0)
  //   );
  // }
}
