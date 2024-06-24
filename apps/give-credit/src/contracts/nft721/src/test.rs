#![cfg(test)]
extern crate std;

use crate::{contract::NonFungibleToken, NonFungibleTokenClient};
use soroban_sdk::{
  symbol_short,
  testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
  Address, BytesN, Env, IntoVal, Symbol,
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

  let admin1 = Address::random(&e);
  let admin2 = Address::random(&e);
  let user1  = Address::random(&e);
  let user2  = Address::random(&e);
  let user3  = Address::random(&e);
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

  let zero  = Address::from_contract_id(&BytesN::from_array(&e, &[0u8; 32]));
  let admin = Address::random(&e);
  let user1 = Address::random(&e);
  let user2 = Address::random(&e);
  let token = create_token(&e, &admin);

  token.mint(&user1);
  assert_eq!(token.balance(&user1), 1);

  token.mint(&user1);
  assert_eq!(token.balance(&user1), 2);

  token.approve(&user1, &user2);
  assert_eq!(token.operator(&user1), user2);

  token.burn_from(&user2, &user1, &1);
  assert_eq!(
    e.auths(),
    std::vec![(
      user2.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          symbol_short!("burn_from"),
          (&user2, &user1, 1_i128).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );

  assert_eq!(token.owner(&1), zero);
  assert_eq!(token.balance(&user1), 1);

  token.burn(&user1, &2);
  assert_eq!(
    e.auths(),
    std::vec![(
      user1.clone(),
      AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
          token.address.clone(),
          symbol_short!("burn"),
          (&user1, 2_i128).into_val(&e),
        )),
        sub_invocations: std::vec![]
      }
    )]
  );

  assert_eq!(token.owner(&2), zero);
  assert_eq!(token.balance(&user2), 0);
}


// Should not transfer not owned token
#[test]
#[should_panic(expected = "user not the owner")]
fn transfer_not_owned() {
  let e = Env::default();
  e.mock_all_auths();

  let admin = Address::random(&e);
  let user1 = Address::random(&e);
  let user2 = Address::random(&e);
  let token = create_token(&e, &admin);

  token.mint(&user1);
  assert_eq!(token.balance(&user1), 1);
  token.transfer(&user1, &user2, &5);  // tokenid 5 not owned by user1
}


// Should not transfer if not approved
#[test]
#[should_panic(expected = "operator not approved")]
fn transfer_not_approved() {
  let e = Env::default();
  e.mock_all_auths();

  let admin = Address::random(&e);
  let user1 = Address::random(&e);
  let user2 = Address::random(&e);
  let user3 = Address::random(&e);
  let user4 = Address::random(&e);
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
  let admin = Address::random(&e);
  let token = create_token(&e, &admin);
  token.initialize(&admin, &"name".into_val(&e), &"symbol".into_val(&e));
}

