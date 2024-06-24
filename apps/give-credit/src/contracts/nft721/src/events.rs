use soroban_sdk::{symbol_short, Address, Env};

pub(crate) fn approve(e: &Env, owner: Address, operator: Address) {
  let topics = (symbol_short!("approve"), operator);
  e.events().publish(topics, owner);
}

pub(crate) fn unapprove(e: &Env, owner: Address) {
  let topics = (symbol_short!("unapprove"), owner.clone());
  e.events().publish(topics, owner);
}

/*
pub(crate) fn approve_all(e: &Env, operator: Address, owner: Address) {
  let topics = (Symbol::new(&e, "approve_all"), operator);
  e.events().publish(topics, owner);
}
*/

pub(crate) fn burn(e: &Env, from: Address, id: i128) {
  let topics = (symbol_short!("burn"), from);
  e.events().publish(topics, id);
}

pub(crate) fn mint(e: &Env, to: Address, id: i128) {
  let topics = (symbol_short!("mint"), to);
  e.events().publish(topics, id);
}

pub(crate) fn set_admin(e: &Env, admin: Address, new_admin: Address) {
  let topics = (symbol_short!("set_admin"), admin);
  e.events().publish(topics, new_admin);
}

pub(crate) fn transfer(e: &Env, from: Address, to: Address, id: i128) {
  let topics = (symbol_short!("transfer"), from, to);
  e.events().publish(topics, id);
}
