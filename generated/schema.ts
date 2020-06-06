// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Moloch extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Moloch entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Moloch entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Moloch", id.toString(), this);
  }

  static load(id: string): Moloch | null {
    return store.get("Moloch", id) as Moloch | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): string {
    let value = this.get("timestamp");
    return value.toString();
  }

  set timestamp(value: string) {
    this.set("timestamp", Value.fromString(value));
  }

  get summoner(): Bytes {
    let value = this.get("summoner");
    return value.toBytes();
  }

  set summoner(value: Bytes) {
    this.set("summoner", Value.fromBytes(value));
  }

  get title(): string | null {
    let value = this.get("title");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (value === null) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(value as string));
    }
  }

  get version(): string | null {
    let value = this.get("version");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set version(value: string | null) {
    if (value === null) {
      this.unset("version");
    } else {
      this.set("version", Value.fromString(value as string));
    }
  }

  get newContract(): string | null {
    let value = this.get("newContract");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set newContract(value: string | null) {
    if (value === null) {
      this.unset("newContract");
    } else {
      this.set("newContract", Value.fromString(value as string));
    }
  }

  get deleted(): boolean {
    let value = this.get("deleted");
    return value.toBoolean();
  }

  set deleted(value: boolean) {
    this.set("deleted", Value.fromBoolean(value));
  }

  get summoningTime(): BigInt {
    let value = this.get("summoningTime");
    return value.toBigInt();
  }

  set summoningTime(value: BigInt) {
    this.set("summoningTime", Value.fromBigInt(value));
  }

  get guildBankAddress(): Bytes | null {
    let value = this.get("guildBankAddress");
    if (value === null) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set guildBankAddress(value: Bytes | null) {
    if (value === null) {
      this.unset("guildBankAddress");
    } else {
      this.set("guildBankAddress", Value.fromBytes(value as Bytes));
    }
  }

  get proposalCount(): BigInt {
    let value = this.get("proposalCount");
    return value.toBigInt();
  }

  set proposalCount(value: BigInt) {
    this.set("proposalCount", Value.fromBigInt(value));
  }

  get memberCount(): BigInt {
    let value = this.get("memberCount");
    return value.toBigInt();
  }

  set memberCount(value: BigInt) {
    this.set("memberCount", Value.fromBigInt(value));
  }

  get voteCount(): BigInt {
    let value = this.get("voteCount");
    return value.toBigInt();
  }

  set voteCount(value: BigInt) {
    this.set("voteCount", Value.fromBigInt(value));
  }

  get rageQuitCount(): BigInt {
    let value = this.get("rageQuitCount");
    return value.toBigInt();
  }

  set rageQuitCount(value: BigInt) {
    this.set("rageQuitCount", Value.fromBigInt(value));
  }

  get balances(): Array<string> | null {
    let value = this.get("balances");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set balances(value: Array<string> | null) {
    if (value === null) {
      this.unset("balances");
    } else {
      this.set("balances", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class Balance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Balance entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Balance entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Balance", id.toString(), this);
  }

  static load(id: string): Balance | null {
    return store.get("Balance", id) as Balance | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): string {
    let value = this.get("timestamp");
    return value.toString();
  }

  set timestamp(value: string) {
    this.set("timestamp", Value.fromString(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get molochAddress(): Bytes {
    let value = this.get("molochAddress");
    return value.toBytes();
  }

  set molochAddress(value: Bytes) {
    this.set("molochAddress", Value.fromBytes(value));
  }

  get moloch(): string {
    let value = this.get("moloch");
    return value.toString();
  }

  set moloch(value: string) {
    this.set("moloch", Value.fromString(value));
  }

  get payment(): boolean {
    let value = this.get("payment");
    return value.toBoolean();
  }

  set payment(value: boolean) {
    this.set("payment", Value.fromBoolean(value));
  }

  get tribute(): boolean {
    let value = this.get("tribute");
    return value.toBoolean();
  }

  set tribute(value: boolean) {
    this.set("tribute", Value.fromBoolean(value));
  }

  get action(): string {
    let value = this.get("action");
    return value.toString();
  }

  set action(value: string) {
    this.set("action", Value.fromString(value));
  }

  get amount(): BigInt | null {
    let value = this.get("amount");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set amount(value: BigInt | null) {
    if (value === null) {
      this.unset("amount");
    } else {
      this.set("amount", Value.fromBigInt(value as BigInt));
    }
  }

  get rageQuitAllShares(): boolean {
    let value = this.get("rageQuitAllShares");
    return value.toBoolean();
  }

  set rageQuitAllShares(value: boolean) {
    this.set("rageQuitAllShares", Value.fromBoolean(value));
  }

  get version(): string {
    let value = this.get("version");
    return value.toString();
  }

  set version(value: string) {
    this.set("version", Value.fromString(value));
  }
}

export class ProposalDetail extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save ProposalDetail entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save ProposalDetail entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("ProposalDetail", id.toString(), this);
  }

  static load(id: string): ProposalDetail | null {
    return store.get("ProposalDetail", id) as ProposalDetail | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get createdAt(): string {
    let value = this.get("createdAt");
    return value.toString();
  }

  set createdAt(value: string) {
    this.set("createdAt", Value.fromString(value));
  }

  get proposalId(): BigInt {
    let value = this.get("proposalId");
    return value.toBigInt();
  }

  set proposalId(value: BigInt) {
    this.set("proposalId", Value.fromBigInt(value));
  }

  get moloch(): string {
    let value = this.get("moloch");
    return value.toString();
  }

  set moloch(value: string) {
    this.set("moloch", Value.fromString(value));
  }

  get molochAddress(): Bytes {
    let value = this.get("molochAddress");
    return value.toBytes();
  }

  set molochAddress(value: Bytes) {
    this.set("molochAddress", Value.fromBytes(value));
  }

  get tributeOffered(): BigInt {
    let value = this.get("tributeOffered");
    return value.toBigInt();
  }

  set tributeOffered(value: BigInt) {
    this.set("tributeOffered", Value.fromBigInt(value));
  }

  get tributeToken(): Bytes {
    let value = this.get("tributeToken");
    return value.toBytes();
  }

  set tributeToken(value: Bytes) {
    this.set("tributeToken", Value.fromBytes(value));
  }

  get paymentRequested(): BigInt {
    let value = this.get("paymentRequested");
    return value.toBigInt();
  }

  set paymentRequested(value: BigInt) {
    this.set("paymentRequested", Value.fromBigInt(value));
  }

  get paymentToken(): Bytes {
    let value = this.get("paymentToken");
    return value.toBytes();
  }

  set paymentToken(value: Bytes) {
    this.set("paymentToken", Value.fromBytes(value));
  }
}
