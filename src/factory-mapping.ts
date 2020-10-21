import { BigInt, log } from "@graphprotocol/graph-ts";
import { Register as RegisterV1 } from "../generated/V1Factory/V1Factory";
import {
  Register as RegisterV2,
  Delete,
} from "../generated/V2Factory/V2Factory";
import { MolochV1Template, MolochV2Template } from "../generated/templates";
import { Moloch, DaoMeta } from "../generated/schema";
import { addSummonBadge, addMembershipBadge, addGas } from "./badges";

export function handleRegisterV1(event: RegisterV1): void {
  if (event.params.newContract.toString() == "0") {
    return;
  }
  MolochV1Template.create(event.params.moloch);

  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.title = event.params.title;
  daoMeta.version = "1";
  daoMeta.newContract = event.params.newContract.toString();
  daoMeta.save();
}

export function handleRegisterV2(event: RegisterV2): void {
  MolochV2Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHex();
  let moloch = new Moloch(molochId);
  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.title = event.params.title;
  daoMeta.version = "2";
  daoMeta.newContract = "1";
  daoMeta.save();

  moloch.timestamp = event.block.timestamp.toString();
  moloch.summoner = event.params.summoner;
  moloch.summoningTime = event.params._summoningTime;
  moloch.title = event.params.title;
  moloch.version = "2";
  moloch.deleted = false;
  moloch.newContract = "1";
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.memberCount = BigInt.fromI32(0);
  moloch.voteCount = BigInt.fromI32(0);
  moloch.rageQuitCount = BigInt.fromI32(0);
  moloch.totalGas = addGas(BigInt.fromI32(0), event.transaction);

  moloch.save();

  addSummonBadge(event.params.summoner, event.transaction);
  addMembershipBadge(event.params.summoner);
}

export function handleDelete(event: Delete): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  moloch.deleted = true;
  moloch.save();
}
