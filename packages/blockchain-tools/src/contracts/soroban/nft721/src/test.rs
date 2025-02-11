#![cfg(test)]
extern crate std;

use crate::{contract::NonFungibleToken, NonFungibleTokenClient};
use soroban_sdk::{
  symbol_short,
  testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
  Address, BytesN, Env, IntoVal, Symbol, String, Bytes
};

fn create_token<'a>(e: &Env, admin: &Address) -> NonFungibleTokenClient<'a> {
  let token = NonFungibleTokenClient::new(e, &e.register_contract(None, NonFungibleToken {}));
  token.initialize(admin, &"name".into_val(e), &"symbol".into_val(e));
  token
}

#[test]
fn test() {
  let e = Env::default();
  e.mock_all_auths();

  let admin1 = Address::generate(&e);
  let admin2 = Address::generate(&e);
  let user1  = Address::generate(&e);
  let user2  = Address::generate(&e);
  let user3  = Address::generate(&e);
  let token  = create_token(&e, &admin1);

  token.mint(&user1);
  assert_eq!(
    e.auths(),
    std::vec![(
      admin1.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          symbol_short!("mint"),
          (&user1,).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );
  assert_eq!(token.balance(&user1), 1);

  token.approve(&user2, &user3);
  assert_eq!(
    e.auths(),
    std::vec![(
      user2.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          symbol_short!("approve"),
          (&user2, &user3).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );
  assert_eq!(token.operator(&user2), user3);

  token.transfer(&user1, &user2, &1);
  assert_eq!(
    e.auths(),
    std::vec![(
      user1.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          symbol_short!("transfer"),
          (&user1, &user2, 1_i128).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );
  assert_eq!(token.balance(&user1), 0);
  assert_eq!(token.balance(&user2), 1);

  token.transfer_from(&user3, &user2, &user1, &1);
  assert_eq!(
    e.auths(),
    std::vec![(
      user3.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          Symbol::new(&e, "transfer_from"),
          (&user3, &user2, &user1, 1_i128).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );
  assert_eq!(token.balance(&user1), 1);
  assert_eq!(token.balance(&user2), 0);

  token.transfer(&user1, &user3, &1);
  assert_eq!(token.balance(&user1), 0);
  assert_eq!(token.balance(&user3), 1);

  token.set_admin(&admin2);
  assert_eq!(
    e.auths(),
    std::vec![(
      admin1.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          symbol_short!("set_admin"),
          (&admin2,).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );
}

// Should burn owned token, set owner to Address(0)
#[test]
fn test_burn() {
    let e = Env::default();
    e.mock_all_auths();

    let admin = Address::generate(&e);
    let user1 = Address::generate(&e);
    let user2 = Address::generate(&e);
    let token = create_token(&e, &admin);

    // Mint token and capture token id (should be 1)
    token.mint(&user1);
    let token_id = token.supply();
    assert_eq!(token.balance(&user1), 1);
    assert_eq!(token.owner(&token_id), Some(user1.clone()));

    token.approve(&user1, &user2);
    token.burn(&user1, &token_id);
    assert_eq!(token.owner(&token_id), None);
    assert_eq!(token.balance(&user1), 0);

    // Mint another token for burn_from (should be token id 2)
    token.mint(&user1);
    let token_id2 = token.supply();
    assert_eq!(token.balance(&user1), 1);
    token.burn_from(&user2, &user1, &token_id2);
    assert_eq!(token.owner(&token_id2), None);
    assert_eq!(token.balance(&user1), 0);
}

// Helper function to test if code panics
fn should_panic<F>(f: F) where F: FnOnce() {
    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(f));
    assert!(result.is_err());
}

// Should not transfer not owned token
#[test]
#[should_panic(expected = "user not the owner")]
fn transfer_not_owned() {
  let e = Env::default();
  e.mock_all_auths();

  let admin = Address::generate(&e);
  let user1 = Address::generate(&e);
  let user2 = Address::generate(&e);
  let user3 = Address::generate(&e);  // Add another user
  let token = create_token(&e, &admin);

  // Mint token #1 to user1
  token.mint(&user1);
  // Mint token #2 to user2 - this ensures the token exists but is owned by someone else
  token.mint(&user2);
  
  assert_eq!(token.balance(&user1), 1);
  // Try to transfer token #2 from user1 (who doesn't own it)
  token.transfer(&user1, &user3, &2);  // This should fail with "user not the owner"
}

// Should not transfer if not approved
#[test]
#[should_panic(expected = "operator not approved")]
fn transfer_not_approved() {
  let e = Env::default();
  e.mock_all_auths();

  let admin = Address::generate(&e);
  let user1 = Address::generate(&e);
  let user2 = Address::generate(&e);
  let user3 = Address::generate(&e);
  let user4 = Address::generate(&e);
  let token = create_token(&e, &admin);

  token.mint(&user1);
  assert_eq!(token.balance(&user1), 1);

  token.approve(&user1, &user2); // user2 is now operator
  assert_eq!(token.operator(&user1), user2);
  token.transfer_from(&user3, &user1, &user4, &1); // should not transfer
}

#[test]
#[should_panic(expected = "already initialized")]
fn initialize_already_initialized() {
  let e = Env::default();
  let admin = Address::generate(&e);
  let token = create_token(&e, &admin);
  token.initialize(&admin, &"name".into_val(&e), &"symbol".into_val(&e));
}


