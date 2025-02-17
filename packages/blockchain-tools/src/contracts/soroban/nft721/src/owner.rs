use crate::storage_types::DataKey;
use soroban_sdk::{Address, Bytes, Env};

fn zero_address(e: &Env) -> Address {
  //Address::from_contract_id(&BytesN::from_array(e, &[0u8; 32]))
  //Address::from_string_bytes(&BytesN::from_array(e, &[0u8; 32]))
  Address::from_string_bytes(&Bytes::from_slice(&e, &[0; 32]))
}

pub fn read_owner(e: &Env, id: i128) -> Option<Address> {
  let key = DataKey::Owner(id);
  e.storage().instance().get(&key)
}

pub fn write_owner(e: &Env, id: i128, owner: Address) {
  let key = DataKey::Owner(id);
  e.storage().instance().set(&key, &owner);
}

pub fn check_owner(e: &Env, user: Address, id: i128) {
  let owner = read_owner(&e, id);
  assert!(owner == Some(user), "user not the owner");
}

pub fn clear_owner(e: &Env, id: i128) {
  let key = DataKey::Owner(id);
  e.storage().instance().remove(&key);
}
