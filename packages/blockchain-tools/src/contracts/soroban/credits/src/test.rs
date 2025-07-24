#![cfg(test)]
extern crate std;

use std::{println as info, println as warn};
use crate::{contract::Credits, CreditsClient};
use soroban_sdk::{
  testutils::Address as _,
  Address,
  Env,
  String,
  token,
};

use crate::test_utils::{
  deploy_native_sac,
  create_account_entry
};

fn create_contract<'a>(
  e: &Env,
  admin: &Address,
  initiative: &String,
  provider: &Address,
  vendor: &Address,
  bucket: i128,
  xlm: &Address
) -> CreditsClient<'a> {
  info!("Creating contract...");

  let contract_id = e.register(
    Credits,
    (
      admin.clone(),
      initiative.clone(),
      provider.clone(),
      vendor.clone(),
      bucket,
      xlm.clone()
    )
  );
  let contract_client = CreditsClient::new(e, &contract_id);
  warn!("Contract created!");
  contract_client
}

#[test]
fn test_views() {
  let e = Env::default();
  e.mock_all_auths();

  let admin   = Address::generate(&e);
  let bucket     = 200000000i128;
  let initiative = String::from_str(&e, "30c0636f-b0f1-40d5-bb9c-a531dc4d69e2");
  let provider   = Address::generate(&e);
  let vendor     = Address::generate(&e);
  let xlm = deploy_native_sac(&e);

  // let xlmID      = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"; // testnet
  // //let xlmID    = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"; // futurenet
  // //let xlm      = Address::generate(&e);
  // let xlm        = Address::from_string(&String::from_str(&e, &xlmID));

  let credit     = create_contract(
    &e,
    &admin,
    &initiative,
    &provider,
    &vendor,
    bucket,
    &xlm
  );

  // Views should all pass
  assert_eq!(credit.getAdmin(), admin);
  assert_eq!(credit.getBalance(), 0);
  assert_eq!(credit.getContractBalance(), 0);
  assert_eq!(credit.getBucket(), 200000000);
  assert_eq!(credit.getInitiative(), initiative);
  assert_eq!(credit.getMinimum(), 1000000);
  assert_eq!(credit.getProvider(), provider);
  assert_eq!(credit.getProviderFees(), 90);
  assert_eq!(credit.getVendor(), vendor);
  assert_eq!(credit.getVendorFees(), 10);
  assert_eq!(credit.getXLM(), xlm);
}


#[test]
fn test_donate() {
  let e = Env::default();
  e.mock_all_auths();

  let admin      = Address::generate(&e);
  let bucket        = 200000000i128;
  let donor      = Address::generate(&e);
  let initiative = String::from_str(&e, "30c0636f-b0f1-40d5-bb9c-a531dc4d69e2");
  let provider   = Address::generate(&e);
  let vendor     = Address::generate(&e);
  
  let xlm = deploy_native_sac(&e);
  let xlm_client = token::Client::new(&e, &xlm);

  let credit     = create_contract(
    &e,
    &admin,
    &initiative,
    &provider,
    &vendor,
    bucket,
    &xlm
  );

  // xlm_client.
  // .mint(&donor, &100000000);

  let xlm_balance = xlm_client.balance(&donor);
  info!("=============>check balance start");
  info!("{}", xlm_balance);
  info!("=============>check balance end");
  assert_eq!(xlm_balance, 10_000_000_000);

  // Donate
  credit.donate(&donor, &100000000);
  assert_eq!(credit.getBalance(), 80000000); // amount - fees
}
