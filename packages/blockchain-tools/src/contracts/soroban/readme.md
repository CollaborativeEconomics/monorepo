# Soroban Contracts

Documentation at https://developers.stellar.org/docs/smart-contracts


# Install

To deploy Soroban contracts please read the docs and install Rust lang, Wasm target and Soroban CLI

https://developers.stellar.org/docs/smart-contracts/getting-started/setup


# Credits

Source code at [/credits/src](/credits/src)

## Methods

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

### Build

```
cargo build --target wasm32-unknown-unknown --release
```

or

```
soroban contract build
```

### Test

```
cargo test
```

Test with logs

```
cargo test -- --nocapture
```

### Optimize

```
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/credits.wasm
```

### Deploy

```
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/credits.wasm \
  --source [wallet secret] \
  --network testnet
```

### Initialize
 - provider gets 90% (i.e Stellar Carbon)
 - vendor gets 10% (i.e. Public Node)
 - bucket is the amount to accumulate before splitting/sending
 - xlm is the contract address of the XLM token

 To get the stellar contract address:
 ```
 stellar contract id asset \
  --network [NETWORK] \
  --asset native
```

#### testnet
```
soroban contract invoke \
  --id [CONTRACT-ID] \
  --source [wallet secret] \
  --network testnet \
  -- initialize \
  --admin [wallet address] \
  --initiative [INITIATIVE-ID] \
  --provider [provider address] \
  --vendor [vender address] \
  --bucket 20000000 \
  --xlm CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

#### mainnet
```
soroban contract invoke \
  --id [CONTRACT-ID] \
  --source [wallet secret] \
  --network mainnet \
  -- initialize \
  --admin [wallet address] \
  --initiative [INITIATIVE-ID] \
  --xlm CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA
```

### Donate

```
soroban contract invoke \
  --id [CONTRACT-ID] \
  --source [G123-ADMIN] \
  --rpc-url [RPC-PROVIDER-URL] \
  --network-passphrase 'Public Global Stellar Network ; September 2015' \
  -- donate \
  --from [G123-DONOR] \
  --amount 10000000
```

### Generate Libraries

```
soroban contract bindings typescript \
  --rpc-url https://soroban.stellar.org \
  --network-passphrase 'Public Global Stellar Network ; September 2015' \
  --contract-id [CONTRACT-ID] \
  --output-dir libs
```


# NFToken

Source code at [/nftoken/src](/nftoken/src)

## Methods

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

## Calls

### Build

```
cargo build \
  --target wasm32-unknown-unknown \
  --release
```

or

```
soroban contract build
```

### Optimize

```
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/nftoken.wasm
```

### Deploy (Once deployed write down the contract ID)

```
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/nftoken.wasm \
  --source [G123-ADMIN] \
  --network [NETWORK]
```

### Initialize

```
soroban contract invoke \
  --id [CONTRACT-ID] \
  --source [G123-ADMIN] \
  --network [NETWORK] \
  -- initialize \
  --admin [G123-ADMIN] \
  --name 'GIVE' \
  --symbol 'GIVE'
```

### Mint

```
soroban contract invoke \
  --id [CONTRACT-ID] \
  --source [G123-ADMIN] \
  --network [NETWORK] \
  -- mint \
  --to [G123-RECEIVER]
```

### Generate Libraries

```
soroban contract bindings typescript \
  --network [NETWORK] \
  --contract-id [CONTRACT-ID] \
  --output-dir libs
```

# Notes

To test, replace MAINNET for FUTURENET rpc providers:

```
  RPC-PROVIDER-URL: https://rpc-futurenet.stellar.org:443
  PASSPHRASE: 'Test SDF Future Network ; October 2022'
```
