#![cfg(test)]
extern crate std;

use std::{println as info, println as warn};
use crate::{contract::Credits, CreditsClient};
use soroban_sdk::{
  testutils::{Address as _, },
  Address, Env, String
};

fn create_contract<'a>(e: &Env, admin: &Address, initiative: u128, provider: &Address, vendor: &Address, bucket: i128, xlm: &Address) -> CreditsClient<'a> {
  info!("Creating contract...");
  let ctr = CreditsClient::new(e, &e.register_contract(None, Credits {}));
  ctr.initialize(admin, &initiative, provider, vendor, &bucket, xlm);
  warn!("Contract created!");
  ctr
}

#[test]
fn test_views() {
  let e = Env::default();
  e.mock_all_auths();

  let admin      = Address::generate(&e);
  let bucket     = 200000000i128;
  let initiative = 31220920570639204721711120384u128;
  let provider   = Address::generate(&e);
  let vendor     = Address::generate(&e);
  let xlmID      = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"; // testnet
  //let xlmID    = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"; // futurenet
  //let xlm      = Address::generate(&e);
  let xlm        = Address::from_string(&String::from_str(&e, &xlmID));
  let credit     = create_contract(&e, &admin, initiative, &provider, &vendor, bucket, &xlm);

  // Views should all pass
  assert_eq!(credit.getAdmin(), admin);
  assert_eq!(credit.getBalance(), 0);
  //assert_eq!(credit.getContractBalance(), 0); // error: xlm contract doesn't exist in local tests
  assert_eq!(credit.getBucket(), 200000000);
  assert_eq!(credit.getInitiative(), initiative);
  assert_eq!(credit.getMinimum(), 1000000);
  assert_eq!(credit.getProvider(), provider);
  assert_eq!(credit.getProviderFees(), 80);
  assert_eq!(credit.getVendor(), vendor);
  assert_eq!(credit.getVendorFees(), 10);
  assert_eq!(credit.getXLM(), xlm);
}

// FAIL: xlm contract doesn't exist in local tests
/*
#[test]
fn test_donate() {
  let e = Env::default();
  e.mock_all_auths();

  let admin      = Address::generate(&e);
  let bucket     = 200000000i128;
  let donor      = Address::generate(&e);
  let initiative = 31220920570639204721711120384u128;
  let provider   = Address::generate(&e);
  let vendor     = Address::generate(&e);
  let xlm        = Address::generate(&e);
  let credit     = create_contract(&e, &admin, initiative, &provider, &vendor, bucket, &xlm);

  // Donate
  credit.donate(&donor, &100000000);
  assert_eq!(credit.getBalance(), 80000000); // amount - fees
}
*/