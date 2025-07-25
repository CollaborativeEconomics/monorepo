#![cfg(test)]

extern crate std;
use std::rc::Rc;

use soroban_env_host::{budget::AsBudget, Env as _, EnvBase};
use soroban_sdk::xdr;
use soroban_sdk::{
    xdr::{Asset, Limits, WriteXdr}, 
    Address, Env, FromVal
};
use stellar_strkey;

pub fn deploy_native_sac(env: &Env) -> Address {
  let xdr_bytes = Asset::Native.to_xdr(Limits::none()).unwrap();
  let asset_slice = xdr_bytes.as_slice();
  let host = env.host();
  let bytes_obj = host.bytes_new_from_slice(asset_slice).unwrap();
  let sac_res = host.create_asset_contract(bytes_obj);
  Address::from_val(env, &sac_res.unwrap())
}

pub fn create_account_entry(env: &Env, pubkey: &str) {
  // Parse the public key from the Stellar address
  let raw_pubkey = stellar_strkey::ed25519::PublicKey::from_string(pubkey)
      .unwrap().0;
  
  // Create an AccountId XDR
  let account_id = xdr::AccountId(
      xdr::PublicKey::PublicKeyTypeEd25519(xdr::Uint256(raw_pubkey))
  );
  
  // Create the account entry
  env.host().with_mut_storage(|storage| {
      let key = Rc::new(xdr::LedgerKey::Account(xdr::LedgerKeyAccount {
          account_id: account_id.clone(),
      }));
      
      // Create account entry data with basic values
      let entry = Rc::new(xdr::LedgerEntry {
          last_modified_ledger_seq: 0,
          data: xdr::LedgerEntryData::Account(xdr::AccountEntry {
              account_id: account_id,
              balance: 10_000_000_000, // 1000 XLM in stroops
              seq_num: xdr::SequenceNumber(1),
              num_sub_entries: 0,
              inflation_dest: None,
              flags: 0,
              home_domain: xdr::String32::default(),
              thresholds: xdr::Thresholds([1, 0, 0, 0]),
              signers: xdr::VecM::default(),
              ext: xdr::AccountEntryExt::V0,
          }),
          ext: xdr::LedgerEntryExt::V0,
      });
      
      // Add the entry to storage
      storage.put(
          &key,
          &entry,
          None,
          env.host().as_budget(),
      ).unwrap();
      
      Ok(())
  }).unwrap();
}