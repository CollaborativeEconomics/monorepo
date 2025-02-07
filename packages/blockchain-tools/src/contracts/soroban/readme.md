# Soroban Contracts

Documentation at https://developers.stellar.org/docs/smart-contracts


## Install

To deploy Soroban contracts please read the docs and install Rust lang, Wasm target and Soroban CLI

https://developers.stellar.org/docs/smart-contracts/getting-started/setup


## Credits

Source code at [/credits/src](/credits/src)

### Methods

```
  initialize(admin: Address, initiative: u128, provider: Address, vendor: Address, bucket: i128, xlm: Address)
  donate(from: Address, amount: i128)
  getAdmin() -> Address
  getBalance() -> i128
  getContractBalance() -> i128
  getBucket() -> i128
  getInitiative() -> u128
  getMinimum() -> i128
  getProvider() -> Address
  getProviderFees() -> i128
  getVendor() -> Address
  getVendorFees() -> i128
  getXLM() -> Address
  setAdmin(newval: Address)
  setBucket(newval: i128)
  setMinimum(newval: i128)
  setProvider(newval: Address)
  setProviderFees(newval: i128)
  setVendor(newval: Address)
  setVendorFees(newval: i128)
  setXLM(newval: Address)
```

### Calls

build

```
cargo build --target wasm32-unknown-unknown --release
```

or

```
soroban contract build
```

test

```
cargo test
```

test with logs

```
cargo test -- --nocapture
```

optimize

```
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/credits.wasm
```

deploy (Once deployed write down the contract ID)

```
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/credits.wasm --source [G123-ADMIN] --rpc-url [RPC-PROVIDER-URL]  --network-passphrase 'Public Global Stellar Network ; September 2015'
```

initialize

```
soroban contract invoke --id [CONTRACT-ID] --source [G123-ADMIN] --rpc-url [RPC-PROVIDER-URL] --network-passphrase 'Public Global Stellar Network ; September 2015' -- initialize --admin [G123-ADMIN] --initiative [INITIATIVE-ID] --provider [G123-PROVIDER] --vendor [G123-VENDOR] --bucket 20000000 --xlm CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA
```

donate

```
soroban contract invoke --id [CONTRACT-ID] --source [G123-ADMIN] --rpc-url [RPC-PROVIDER-URL] --network-passphrase 'Public Global Stellar Network ; September 2015' -- donate --from [G123-DONOR] --amount 10000000
```

generate libraries

```
soroban contract bindings typescript --rpc-url https://soroban.stellar.org --network-passphrase 'Public Global Stellar Network ; September 2015' --contract-id [CONTRACT-ID] --output-dir libs
```


## NFToken

Source code at [/nftoken/src](/nftoken/src)

### Methods

```
  initialize(admin: Address, name: String, symbol: String)
  set_admin(new_admin: Address)
  approve(owner: Address, operator: Address)
  unapprove(owner: Address)
  mint(to: Address)
  transfer(from: Address, to: Address, id: i128)
  transfer_from(operator: Address, from: Address, to: Address, id: i128)
  burn(from: Address, id: i128)
  burn_from(operator: Address, from: Address, id: i128)
  admin() -> Address
  balance(id: Address) -> i128
  name() -> String
  operator(owner: Address) -> Address
  owner(id: i128) -> Address
  supply() -> i128
  symbol() -> String
  token_uri() -> String
```

### Calls

build

```
cargo build --target wasm32-unknown-unknown --release
```

or

```
soroban contract build
```

optimize

```
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/nftoken.wasm
```

deploy (Once deployed write down the contract ID)

```
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/nftoken.wasm --source [G123-ADMIN] --rpc-url [RPC-PROVIDER-URL] --network-passphrase 'Public Global Stellar Network ; September 2015'
```

initialize

```
soroban contract invoke --id [CONTRACT-ID] --source [G123-ADMIN] --rpc-url [RPC-PROVIDER-URL] --network-passphrase 'Public Global Stellar Network ; September 2015' -- initialize --admin [G123-ADMIN] --name 'GIVE' --symbol 'GIVE'
```

mint

```
soroban contract invoke --id [CONTRACT-ID] --source [G123-ADMIN] --rpc-url [RPC-PROVIDER-URL] --network-passphrase 'Public Global Stellar Network ; September 2015' -- mint --to [G123-RECEIVER]
```

generate libraries

```
soroban contract bindings typescript --rpc-url https://soroban.stellar.org --network-passphrase 'Public Global Stellar Network ; September 2015' --contract-id [CONTRACT-ID] --output-dir libs
```

## Notes

To test, replace MAINNET for FUTURENET rpc providers:

```
  RPC-PROVIDER-URL: https://rpc-futurenet.stellar.org:443
  PASSPHRASE: 'Test SDF Future Network ; October 2022'
```
