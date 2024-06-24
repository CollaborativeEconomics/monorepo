#![allow(non_snake_case)]
use crate::admin::{check_admin, has_administrator, read_administrator, write_administrator};
use crate::events;
use crate::storage::{
  read_balance, write_balance,
  read_bucket, write_bucket,
  read_initiative, write_initiative,
  read_minimum, write_minimum,
  read_provider, write_provider,
  read_provider_fees, write_provider_fees,
  read_vendor, write_vendor,
  read_vendor_fees, write_vendor_fees,
  read_xlm, write_xlm,
};
use soroban_sdk::{contract, contractimpl, token, Address, Env};

//const xlmNative: &str = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT";  // futurenet
//const xlmNative: &str = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";  // testnet


#[contract]
pub struct Credits;

#[contractimpl]
impl Credits {
  pub fn initialize(e: Env, admin: Address, initiative: u128, provider: Address, vendor: Address, bucket: i128, xlm: Address) {
    if has_administrator(&e) { panic!("already initialized") }
    write_administrator(&e, &admin);
    write_balance(&e, 0);
    write_bucket(&e, bucket);
    write_initiative(&e, initiative);
    write_minimum(&e, 1000000);
    write_provider(&e, &provider);
    write_provider_fees(&e, 90);
    write_vendor(&e, &vendor);
    write_vendor_fees(&e, 10);
    write_xlm(&e, &xlm);
  }

  //---- METHODS

  pub fn register(_: Env, from: Address) {
    from.require_auth();
  }

  pub fn donate(e: Env, from: Address, amount: i128) {
    if amount <= 0 { panic!("amount less than zero") }
    let minimum = read_minimum(&e);
    if amount < minimum { panic!("amount less than minimum allowed") }
    from.require_auth();
    let thisctr = &e.current_contract_address();
    let provider = read_provider(&e);
    let providerFees = read_provider_fees(&e);
    let vendorFees = read_vendor_fees(&e);
    let balance = read_balance(&e);
    let bucket = read_bucket(&e);
    let pfees = (amount * providerFees / 100) as i128;
    let vfees = (amount * vendorFees / 100) as i128;
    //instance_bump(&e);
    let ctr = &read_xlm(&e);
    let xlm = token::Client::new(&e, &ctr);
    xlm.transfer(&from, &thisctr, &amount); // From donor to contract
    if vfees > 0 {
      let vendor = read_vendor(&e);
      xlm.transfer(&thisctr, &vendor, &vfees); // Vendor fees from contract to vendor
    }
    let newbalance = balance + pfees; // Accumulate carbon credits
    if newbalance >= bucket {
      let reminder = newbalance % bucket;
      let credits  = newbalance - reminder;
      xlm.transfer(&thisctr, &provider, &credits); // Credits from contract to provider
      write_balance(&e, reminder);
    } else {
      write_balance(&e, newbalance);
    }
    events::donation(&e, from, provider, amount);
  }

  //---- VIEWS

  pub fn getAdmin(e: Env) -> Address {
    read_administrator(&e)
  }

  pub fn getBalance(e: Env) -> i128 {
    read_balance(&e)
  }

  pub fn getContractBalance(e: Env) -> i128 {
    let adr = e.current_contract_address();
    let ctr = read_xlm(&e);
    let xlm = token::Client::new(&e, &ctr);
    xlm.balance(&adr)
  }

  pub fn getBucket(e: Env) -> i128 {
    read_bucket(&e)
  }

  pub fn getInitiative(e: Env) -> u128 {
    read_initiative(&e)
  }

  pub fn getMinimum(e: Env) -> i128 {
    read_minimum(&e)
  }

  pub fn getProvider(e: Env) -> Address {
    read_provider(&e)
  }

  pub fn getProviderFees(e: Env) -> i128 {
    read_provider_fees(&e)
  }

  pub fn getVendor(e: Env) -> Address {
    read_vendor(&e)
  }

  pub fn getVendorFees(e: Env) -> i128 {
    read_vendor_fees(&e)
  }

  pub fn getXLM(e: Env) -> Address {
    read_xlm(&e)
  }

  //---- UPDATES

  pub fn setAdmin(e: Env, newval: Address) {
    check_admin(&e);
    //instance_bump(&e);
    let admin = read_administrator(&e);
    write_administrator(&e, &newval);
    events::admin(&e, admin, newval);
  }

  pub fn setBucket(e: Env, newval: i128) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_bucket(&e);
    write_bucket(&e, newval);
    events::bucket(&e, oldval, newval);
  }

  pub fn setMinimum(e: Env, newval: i128) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_minimum(&e);
    write_minimum(&e, newval);
    events::minimum(&e, oldval, newval);
  }

  pub fn setProvider(e: Env, newval: Address) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_provider(&e);
    write_provider(&e, &newval);
    events::provider(&e, oldval, newval);
  }

  pub fn setProviderFees(e: Env, newval: i128) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_provider_fees(&e);
    write_provider_fees(&e, newval);
    events::providerFees(&e, oldval, newval);
  }

  pub fn setVendor(e: Env, newval: Address) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_vendor(&e);
    write_vendor(&e, &newval);
    events::vendor(&e, oldval, newval);
  }

  pub fn setVendorFees(e: Env, newval: i128) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_vendor_fees(&e);
    write_vendor_fees(&e, newval);
    events::vendorFees(&e, oldval, newval);
  }

  pub fn setXLM(e: Env, newval: Address) {
    check_admin(&e);
    //instance_bump(&e);
    let oldval = read_xlm(&e);
    write_xlm(&e, &newval);
    events::xlm(&e, oldval, newval);
  }
}
