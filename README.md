# CFCE Monorepo

This is the CFCE Monorepo.

## Using this example
 
 - Run `nvm use`, or use node 18+
 - Set up turbo`npm i -g turbo`
 - Set up pnpm `npm i -g pnpm`
 - Run `bash setup-packages.sh` from the root to install and build all packages

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

 - giving-universe: base app to copy from. Enables all chains and features.
 - registry: holds API access to the database.
 - partners: Partner portal for organization management.
 - give-credits: Reskin of giving-universe with custom carbon credit features

### Packages

- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@cfce/typescript-config`: `tsconfig.json`s used throughout the monorepo


Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

