#![allow(non_snake_case)]
use crate::storage::DataKey;
use soroban_sdk::{Address, Env};

pub fn read_administrator(e: &Env) -> Address {
  let key = DataKey::Admin;
  e.storage().instance().get(&key).unwrap()
}

pub fn write_administrator(e: &Env, id: &Address) {
  let key = DataKey::Admin;
  e.storage().instance().set(&key, &id);
}

pub fn check_admin(e: &Env) {
  let admin = read_administrator(&e);
  admin.require_auth();
}
