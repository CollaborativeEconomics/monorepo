use soroban_sdk::{Env, String};
use crate::storage_types::DataKey;


pub fn read_name(e: &Env) -> String {
  let key = DataKey::Name;
  let val = e.storage().instance().get(&key);
  match val {
    Some(name) => name,
    None => String::from_str(&e, "")
  }
}

pub fn write_name(e: &Env, name: String) {
  let key = DataKey::Name;
  e.storage().instance().set(&key, &name);
}

pub fn read_symbol(e: &Env) -> String {
  let key = DataKey::Symbol;
  let val = e.storage().instance().get(&key);
  match val {
    Some(name) => name,
    None => String::from_str(&e, "")
  }
}

pub fn write_symbol(e: &Env, symbol: String) {
  let key = DataKey::Symbol;
  e.storage().instance().set(&key, &symbol);
}
