#![no_std]
#![allow(non_snake_case)]

mod admin;
mod contract;
mod events;
mod storage;
mod test;
mod test_utils;

pub use crate::contract::CreditsClient;

mod sink_contract {
  soroban_sdk::contractimport!(
    file = "external-contracts/sink-carbon_v0.3.0.wasm"
  );
}