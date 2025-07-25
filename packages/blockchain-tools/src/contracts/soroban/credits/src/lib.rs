#![no_std]
#![allow(non_snake_case)]

mod admin;
mod contract;
mod events;
mod storage;
mod test;
mod test_utils;

pub use crate::contract::CreditsClient;
