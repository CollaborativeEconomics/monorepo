# CFCE Monorepo

This is the CFCE Monorepo.

## Using this example
 
 - Run `nvm use`, or use node 18+
 - Set up turbo`npm i -g turbo`
 - Set up pnpm `npm i -g pnpm` then `npx corepack up`
 - Copy the `.env.example` files to `.env.local` for each app
 - Run `pnpm install` from the root to install all packages
 - Run `turbo build` to build all apps and packages

## Troubleshooting
### Types not updating
Try restarting the typescript server: `cmd + shift + p`, then type `restart Typescript server`

### Clearing cache and stuff
Run `pnpm delete-node-modules` to delete all the node modules in the monorepo, then run `pnpm install`
Run `pnpm update-dependencies` to update all the dependencies in the monorepo
Run `pnpm match-versions` to make sure all the versions are synced (especially important for typescript and jotai)


 You can run `turbo watch build` to automatically build packages as you change and update them so the changes appear immediately as you're developing.

## Apps

 - giving-universe: base app to copy from. Enables all chains and features.
 - registry: holds API access to the database.
 - partners: Partner portal for organization management.
 - give-credits: Reskin of giving-universe with custom carbon credit features

## Packages

- `@cfce/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@cfce/blockchain-tools`: Tools for interacting with various blockchain networks
- `@cfce/ipfs`: IPFS uploads and interface
- `@cfce/utils`: Composite functions that bring together multiple tools
- `@cfce/app-config`: Static configuration for each app (see app-config/src/config/*)
- `@cfce/database`: CRUD operations, Prisma definition, and types for DB interaction
- `@cfce/registry-hooks`: Hook/action functions for interacting with the registry and automating tasks
- `@cfce/types`: Shared type definitions
- `@cfce/universe-api`: The registry API
- `@cfce/universe-components`: Reusable components
- `@cfce/universe-pages`: Page components (depends on universe-components)

## Adding a chain

1. Add the chain to `packages/database/src/prisma/schema.prisma` chain enum
1. Add the chain to `packages/types/src/BlockchainTools.ts` (Chain, TokenTickerSymbol if relevant, ChainNames, and ChainSlugs)
1. Add the chain to `packages/blockchain-tools/src/chains/chainConfig.ts` (entry + at least one network)

## Using the blockchain tools

For server-side blockchain interactions that require a wallet secret, use `${CHAIN_NAME}_WALLET_SECRET` from the .env.local file (e.g. `STELLAR_WALLET_SECRET` or `XRPL_WALLET_SECRET`).
