use crate::storage_types::DataKey;
use soroban_sdk::{Address, Bytes, Env};
//use soroban_sdk::xdr::{AccountId, PublicKey, ScAddress, ScVal, Uint256};

fn zero_address(e: &Env) -> Address {
  //Address::from_contract_id(&BytesN::from_array(e, &[0u8; 32]))
  //Identifier::Ed25519(BytesN::from_array(e, &[0u8; 32]))
  //let zero_addr: Address = Address::try_from_val(&env, &zero_sc_addr).unwrap();
  //let zero_sc_addr = ScVal::Object(Some(ScObject::Address(ScAddress::Account(AccountId(PublicKey::PublicKeyTypeEd25519(Uint256([0u8; 32])))))));
  //Address::try_from_val(&e, &zero_sc_addr).unwrap();
  Address::from_string_bytes(&Bytes::from_slice(&e, &[0; 32]))
}

pub fn read_operator(e: &Env, owner: Address) -> Address {
  let key = DataKey::Operator(owner);
  let val = e.storage().instance().get(&key);
  match val {
    Some(operator) => operator,
    None => zero_address(&e)
  }
}

pub fn write_operator(e: &Env, owner: Address, operator: Address) {
  let key = DataKey::Operator(owner);
  e.storage().instance().set(&key, &operator);
}

pub fn check_operator(e: &Env, operator: Address, owner: Address) {
  assert!(operator == read_operator(e, owner), "operator not approved");
}

pub fn clear_operator(e: &Env, owner: Address) {
  let key = DataKey::Operator(owner);
  e.storage().instance().set(&key, &zero_address(&e));
}
