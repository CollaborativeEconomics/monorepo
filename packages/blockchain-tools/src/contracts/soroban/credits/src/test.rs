#![cfg(test)]
extern crate std;

use std::{println as info, println as warn};
use crate::{contract::Credits, CreditsClient};
use soroban_sdk::{
  testutils::Address as _, token, Address, Env, String
};

use crate::test_utils::{deploy_native_sac, create_account_entry};

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

  let admin = Address::generate(&e);
  let bucket = 200_000_000_i128;
  let initiative = String::from_str(&e, "30c0636f-b0f1-40d5-bb9c-a531dc4d69e2");
  let provider = Address::generate(&e);
  let vendor = Address::generate(&e);
  let xlm = deploy_native_sac(&e);

  let credit = create_contract(
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

  let admin = Address::generate(&e);
  let bucket = 200_000_000;
  let donor_pubkey = "GA2H3SJYGIUG2DXXUZ7IN3LNO2AIMVWCDCL25PKQHKMC76OWW3HYQHY4";
  let donor = Address::from_str(&e, donor_pubkey);

  let initiative = String::from_str(&e, "30c0636f-b0f1-40d5-bb9c-a531dc4d69e2");
  let provider = Address::generate(&e);
  let vendor = Address::generate(&e);
  
  let xlm = deploy_native_sac(&e);
  let xlm_client = token::Client::new(&e, &xlm);

  let credit = create_contract(
    &e,
    &admin,
    &initiative,
    &provider,
    &vendor,
    bucket,
    &xlm
  );

  create_account_entry(&e, &donor_pubkey);
  assert_eq!(xlm_client.balance(&donor), 10_000_000_000);

  // Donate
  credit.donate(&donor, &100_000_000);
  assert_eq!(credit.getBalance(), 90_000_000); // amount - vendor fees
  assert_eq!(credit.getContractBalance(), 90_000_000);
  assert_eq!(xlm_client.balance(&donor), 9_900_000_000);
}
