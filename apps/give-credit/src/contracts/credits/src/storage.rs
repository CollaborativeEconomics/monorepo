#![allow(non_snake_case)]
use soroban_sdk::{contracttype, Address, Bytes, Env};

//pub(crate) const DAY_IN_LEDGERS: u32 = 17280;
//pub(crate) const BALANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
//pub(crate) const BALANCE_LIFETIME_THRESHOLD: u32 = BALANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;
//pub(crate) const INSTANCE_BUMP_AMOUNT: u32 = 7 * DAY_IN_LEDGERS;
//pub(crate) const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;


#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Balance,
    Bucket,
    Initiative,
    Minimum,
    Provider,
    ProviderFees,
    Vendor,
    VendorFees,
    XLM
}

//pub fn instance_bump(e: &Env){
//  e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
//}

fn zero_address(e: &Env) -> Address {
  Address::from_string_bytes(&Bytes::from_slice(&e, &[0; 32]))
  //Address::from_contract_id(&BytesN::from_array(e, &[0u8; 32]))
  //Address::new([0u8; 32])
}


//---- READ/WRITE

pub fn read_balance(e: &Env) -> i128 {
  let key = DataKey::Balance;
  match e.storage().persistent().get(&key) {
    Some(balance) => balance,
    None => 0
  }
}
/*
pub fn increment_balance(e: &Env, amount: i128) -> i128 {
  let key = DataKey::Balance;
  let val = read_balance(&e) + amount;
  e.storage().persistent().set(&key, &val);
  val
}
*/
pub fn write_balance(e: &Env, amount: i128) {
  let key = DataKey::Balance;
  e.storage().persistent().set(&key, &amount);
}

pub fn read_bucket(e: &Env) -> i128 {
  let key = DataKey::Bucket;
  let val = e.storage().instance().get(&key);
  match val {
    Some(amount) => amount,
    None => 0
  }
}

pub fn write_bucket(e: &Env, value: i128) {
  let key = DataKey::Bucket;
  e.storage().instance().set(&key, &value);
}

pub fn read_initiative(e: &Env) -> u128 {
  let key = DataKey::Initiative;
  let val = e.storage().instance().get(&key);
  match val {
    Some(amount) => amount,
    None => 0
  }
}

pub fn write_initiative(e: &Env, value: u128) {
  let key = DataKey::Initiative;
  e.storage().instance().set(&key, &value);
}

pub fn read_minimum(e: &Env) -> i128 {
  let key = DataKey::Minimum;
  let val = e.storage().instance().get(&key);
  match val {
    Some(amount) => amount,
    None => 0
  }
}

pub fn write_minimum(e: &Env, value: i128) {
  let key = DataKey::Minimum;
  e.storage().instance().set(&key, &value);
}

pub fn read_provider(e: &Env) -> Address {
  let key = DataKey::Provider;
  let val = e.storage().instance().get(&key);
  match val {
    Some(addr) => addr,
    None => zero_address(&e)
  }
}

pub fn write_provider(e: &Env, value: &Address) {
  let key = DataKey::Provider;
  e.storage().instance().set(&key, &value);
}

pub fn read_provider_fees(e: &Env) -> i128 {
  let key = DataKey::ProviderFees;
  let val = e.storage().instance().get(&key);
  match val {
    Some(amount) => amount,
    None => 0
  }
}

pub fn write_provider_fees(e: &Env, value: i128) {
  let key = DataKey::ProviderFees;
  e.storage().instance().set(&key, &value);
}

pub fn read_vendor(e: &Env) -> Address {
  let key = DataKey::Vendor;
  let val = e.storage().instance().get(&key);
  match val {
    Some(addr) => addr,
    None => zero_address(&e)
  }
}

pub fn write_vendor(e: &Env, value: &Address) {
  let key = DataKey::Vendor;
  e.storage().instance().set(&key, &value);
}

pub fn read_vendor_fees(e: &Env) -> i128 {
  let key = DataKey::VendorFees;
  let val = e.storage().instance().get(&key);
  match val {
    Some(amount) => amount,
    None => 0
  }
}

pub fn write_vendor_fees(e: &Env, value: i128) {
  let key = DataKey::VendorFees;
  e.storage().instance().set(&key, &value);
}

pub fn read_xlm(e: &Env) -> Address {
  let key = DataKey::XLM;
  let val = e.storage().persistent().get(&key);
  match val {
    Some(addr) => addr,
    None => zero_address(&e)
  }
}

pub fn write_xlm(e: &Env, value: &Address) {
  let key = DataKey::XLM;
  e.storage().persistent().set(&key, &value);
}
