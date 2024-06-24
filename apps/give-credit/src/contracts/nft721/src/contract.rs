//! Implementation of Soroban NFT721 interface
use crate::admin::{check_admin, has_administrator, read_administrator, write_administrator};
use crate::balance::{read_balance, receive_balance, spend_balance, read_supply, increment_supply};
use crate::events;
use crate::metadata::{read_name, read_symbol, write_name, write_symbol};
use crate::operator::{check_operator, clear_operator, read_operator, write_operator};
use crate::owner::{check_owner, clear_owner, read_owner, write_owner};
//use crate::storage_types::{instance_bump};
use soroban_sdk::{contract, contractimpl, Address, Env, String};


fn check_nonnegative_amount(amount: i128) {
  if amount < 0 {
    panic!("negative amount is not allowed: {}", amount)
  }
}

#[contract]
pub struct NonFungibleToken;

#[contractimpl]
impl NonFungibleToken {
  pub fn initialize(e: Env, admin: Address, name: String, symbol: String) {
    if has_administrator(&e) { panic!("already initialized") }
    write_administrator(&e, &admin);
    write_name(&e, name);
    write_symbol(&e, symbol);
  }

  // Allows to change the admin address
  pub fn set_admin(e: Env, new_admin: Address) {
    check_admin(&e);
    //instance_bump(&e);
    let admin = read_administrator(&e);
    write_administrator(&e, &new_admin);
    events::set_admin(&e, admin, new_admin);
  }

  // Approve operator to mint/transfer/burn in the name of owner
  pub fn approve(e: Env, owner: Address, operator: Address) {
    owner.require_auth();
    //instance_bump(&e);
    write_operator(&e, owner.clone(), operator.clone());
    events::approve(&e, owner, operator);
  }

  // Remove operator from owner
  pub fn unapprove(e: Env, owner: Address) {
    owner.require_auth();
    //instance_bump(&e);
    clear_operator(&e, owner.clone());
    events::unapprove(&e, owner);
  }

  // Mint autoincrement
  pub fn mint(e: Env, to: Address) {
    check_admin(&e);
    //instance_bump(&e);
    let id = increment_supply(&e);
    receive_balance(&e, to.clone(), 1);
    write_owner(&e, id, to.clone());
    events::mint(&e, to, id);
  }

  // Transfer ownership of token id
  pub fn transfer(e: Env, from: Address, to: Address, id: i128) {
    from.require_auth();
    check_nonnegative_amount(id);
    check_owner(&e, from.clone(), id);
    //instance_bump(&e);
    spend_balance(&e, from.clone(), 1);
    receive_balance(&e, to.clone(), 1);
    write_owner(&e, id, to.clone());
    events::transfer(&e, from, to, id);
  }

  // Transfer ownership of token id by operator
  pub fn transfer_from(e: Env, operator: Address, from: Address, to: Address, id: i128) {
    operator.require_auth();
    check_nonnegative_amount(id);
    check_owner(&e, from.clone(), id);
    check_operator(&e, operator, from.clone());
    //instance_bump(&e);
    spend_balance(&e, from.clone(), 1);
    receive_balance(&e, to.clone(), 1);
    write_owner(&e, id, to.clone());
    events::transfer(&e, from, to, id)
  }

  // Burn token id by owner
  pub fn burn(e: Env, from: Address, id: i128) {
    from.require_auth();
    check_nonnegative_amount(id);
    check_owner(&e, from.clone(), id);
    //instance_bump(&e);
    spend_balance(&e, from.clone(), 1);
    clear_owner(&e, id);
    events::burn(&e, from, id);
  }

  // Burn token id by operator
  pub fn burn_from(e: Env, operator: Address, from: Address, id: i128) {
    operator.require_auth();
    check_nonnegative_amount(id);
    check_owner(&e, from.clone(), id);
    check_operator(&e, operator, from.clone());
    //instance_bump(&e);
    spend_balance(&e, from.clone(), 1);
    clear_owner(&e, id);
    events::burn(&e, from, id)
  }

  //---- VIEWS

  pub fn admin(e: Env) -> Address {
    read_administrator(&e)
  }

  pub fn balance(e: Env, id: Address) -> i128 {
    read_balance(&e, id)
  }

  pub fn name(e: Env) -> String {
    read_name(&e)
  }

  pub fn operator(e: Env, owner: Address) -> Address {
    read_operator(&e, owner)
  }

  pub fn owner(e: Env, id: i128) -> Address {
    read_owner(&e, id)
  }

  pub fn supply(e: Env) -> i128 {
    read_supply(&e)
  }

  pub fn symbol(e: Env) -> String {
    read_symbol(&e)
  }

  pub fn token_uri(e: Env) -> String {
    let uri = "https://example.com/nft";
    String::from_str(&e, uri)
  }
}
