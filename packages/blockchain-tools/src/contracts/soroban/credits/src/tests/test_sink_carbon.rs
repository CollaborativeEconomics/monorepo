#![cfg(test)]

extern crate std;

use soroban_sdk::{
  token::StellarAssetClient,
  testutils::{Address as _, IssuerFlags, MockAuth, MockAuthInvoke},
  Address, Env, IntoVal,
};
use crate::{ sink_contract };

pub struct SinkCarbonSetup<'a> {
  pub env: Env,
  // pub funder: Address,
  // pub carbon_sac: StellarAssetContract,
  pub carbonsink_issuer: Address,
  // pub carbonsink_sac: StellarAssetContract,
  pub contract_id: Address,
  pub sink_client: sink_contract::Client<'a>,
}

pub fn set_up_contracts_and_funder<'a>(funder_balance: i128, env_opt: Option<Env>) -> SinkCarbonSetup<'a> {
  let env = env_opt.unwrap_or_default();

  let funder = Address::generate(&env);
  let carbon_issuer = Address::generate(&env);  // this is a C-address
  let carbonsink_issuer = Address::generate(&env);  // this is a C-address
  let carbon_sac = env.register_stellar_asset_contract_v2(carbon_issuer.clone());
  let carbonsink_sac = env.register_stellar_asset_contract_v2(carbonsink_issuer.clone());
  // WARNING: carbon_sac.issuer().address() is a G-address (some conversion by testutils)
  carbonsink_sac.issuer().set_flag(IssuerFlags::RevocableFlag);
  carbonsink_sac.issuer().set_flag(IssuerFlags::RequiredFlag);

  // set CarbonSINK issuer as the sink contract admin
  let contract_id = env.register(
      sink_contract::WASM, 
      (&carbonsink_issuer, &carbon_sac.address(), &carbonsink_sac.address())
  );
  let carbon_sac_client = StellarAssetClient::new(&env, &carbon_sac.address());
  let carbonsink_sac_client = StellarAssetClient::new(&env, &carbonsink_sac.address());

  // set the sink contract as the CarbonSINK SAC admin
  carbonsink_sac_client
    .mock_auths(&[MockAuth {
      address: &carbonsink_issuer,
      invoke: &MockAuthInvoke {
        contract: &carbonsink_sac.address(),
        fn_name: "set_admin",
        args: (&contract_id,).into_val(&env),
        sub_invokes: &[],
      },
    }])
    .set_admin(&contract_id);

  // give the funder an initial balance of `funder_balance` CARBON
  carbon_sac_client
    .mock_auths(&[MockAuth {
      address: &carbon_issuer,
      invoke: &MockAuthInvoke {
        contract: &carbon_sac.address(),
        fn_name: "mint",
        args: (&funder, &funder_balance).into_val(&env),
        sub_invokes: &[],
      },
    }])
    .mint(&funder, &funder_balance);

  let sink_client = sink_contract::Client::new(&env, &contract_id);

  SinkCarbonSetup {
    env, carbonsink_issuer, sink_client,
    contract_id,
    // carbonsink_sac, funder, carbon_sac
  }
}


#[test]
#[should_panic = "HostError: Error(Auth, InvalidAction)"]
fn test_set_successor_unauthorized() {
  let setup = set_up_contracts_and_funder(0, None);
  let client = setup.sink_client;

  // it should fail because the call lacks admin auth
  client.set_contract_successor(&client.address);
}

#[test]
fn test_set_and_get_successor() {
  let setup = set_up_contracts_and_funder(0, None);
  let client = setup.sink_client;
  let admin = setup.carbonsink_issuer;
  let new_contract = Address::generate(&setup.env);

  // set new contract successor
  client
      .mock_auths(&[MockAuth {
          address: &admin,
          invoke: &MockAuthInvoke {
              contract: &client.address,
              fn_name: "set_contract_successor",
              args: (&new_contract,).into_val(&setup.env),
              sub_invokes: &[],
          },
      }])
      .set_contract_successor(&new_contract);

  let successor: Address = client.get_contract_successor();
  assert_eq!(successor, new_contract);
}

#[test]
fn test_set_and_get_successor_multiple() {
  let first_setup = set_up_contracts_and_funder(0, None);
  let second_setup = set_up_contracts_and_funder(0, None);
  let third_setup = set_up_contracts_and_funder(0, None);

  // set successor for third sink carbon
  let mut successor: Address = second_setup.contract_id;
  third_setup.sink_client
    .mock_auths(&[MockAuth {
        address: &third_setup.carbonsink_issuer,
        invoke: &MockAuthInvoke {
            contract: &third_setup.sink_client.address,
            fn_name: "set_contract_successor",
            args: (&successor,).into_val(&third_setup.env),
            sub_invokes: &[],
        },
    }])
    .set_contract_successor(&successor);
  assert_eq!(third_setup.sink_client.get_contract_successor(), successor);

  // set successor for second sink carbon
  successor = first_setup.contract_id;
  second_setup.sink_client
    .mock_auths(&[MockAuth {
        address: &second_setup.carbonsink_issuer,
        invoke: &MockAuthInvoke {
            contract: &second_setup.sink_client.address,
            fn_name: "set_contract_successor",
            args: (&successor,).into_val(&second_setup.env),
            sub_invokes: &[],
        },
    }])
    .set_contract_successor(&successor);
  assert_eq!(second_setup.sink_client.get_contract_successor(), successor);

}