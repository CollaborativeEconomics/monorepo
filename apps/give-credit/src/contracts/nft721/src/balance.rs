use crate::storage_types::{DataKey};
use soroban_sdk::{Address, Env};

pub fn read_balance(e: &Env, addr: Address) -> i128 {
  let key = DataKey::Balance(addr);
  if let Some(balance) = e.storage().persistent().get::<DataKey, i128>(&key) {
    //e.storage().persistent().bump(&key, BALANCE_LIFETIME_THRESHOLD, BALANCE_BUMP_AMOUNT);
    balance
  } else {
    0
  }
}

fn write_balance(e: &Env, addr: Address, amount: i128) {
  let key = DataKey::Balance(addr);
  e.storage().persistent().set(&key, &amount);
  //e.storage().persistent().bump(&key, BALANCE_LIFETIME_THRESHOLD, BALANCE_BUMP_AMOUNT);
}

pub fn receive_balance(e: &Env, addr: Address, amount: i128) {
  let balance = read_balance(e, addr.clone());
  write_balance(e, addr, balance + amount);
}

pub fn spend_balance(e: &Env, addr: Address, amount: i128) {
  let balance = read_balance(e, addr.clone());
  if balance < amount {
    panic!("insufficient balance");
  }
  write_balance(e, addr, balance - amount);
}

pub fn read_supply(e: &Env) -> i128 {
  let key = DataKey::Supply;
  match e.storage().persistent().get::<DataKey, i128>(&key) {
    Some(balance) => balance,
    None => 0,
  }
}

pub fn increment_supply(e: &Env) -> i128 {
  let key = DataKey::Supply;
  let cnt = read_supply(&e) + 1;
  e.storage().persistent().set(&key, &cnt);
  cnt
}
