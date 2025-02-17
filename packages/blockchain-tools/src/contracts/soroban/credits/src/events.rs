#![allow(non_snake_case)]
use soroban_sdk::{symbol_short, Address, Env};

pub(crate) fn admin(e: &Env, oldValue: Address, newValue: Address) {
  let topics = (symbol_short!("admin"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}

pub(crate) fn bucket(e: &Env, oldValue: i128, newValue: i128) {
  let topics = (symbol_short!("bucket"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}

pub(crate) fn donation(e: &Env, from: Address, destin: Address, amount: i128) {
  let topics = (symbol_short!("donation"), from, destin);
  e.events().publish(topics, amount);
}

pub(crate) fn minimum(e: &Env, oldValue: i128, newValue: i128) {
  let topics = (symbol_short!("minimum"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}

pub(crate) fn provider(e: &Env, oldValue: Address, newValue: Address) {
  let topics = (symbol_short!("provider"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}

pub(crate) fn providerFees(e: &Env, oldValue: i128, newValue: i128) {
  let topics = (symbol_short!("provfees"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}
/*
pub(crate) fn transfer(e: &Env, from: Address, destin: Address, amount: i128) {
  let topics = (symbol_short!("transfer"), from, destin);
  e.events().publish(topics, amount);
}
*/
pub(crate) fn vendor(e: &Env, oldValue: Address, newValue: Address) {
  let topics = (symbol_short!("vendor"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}

pub(crate) fn vendorFees(e: &Env, oldValue: i128, newValue: i128) {
  let topics = (symbol_short!("vendfees"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}
/*
pub(crate) fn withdraw(e: &Env, destin: Address, amount: i128) {
  let topics = (symbol_short!("withdraw"), destin);
  e.events().publish(topics, amount);
}
*/
pub(crate) fn xlm(e: &Env, oldValue: Address, newValue: Address) {
  let topics = (symbol_short!("xlm"), symbol_short!("change"));
  e.events().publish(topics, (oldValue, newValue));
}
