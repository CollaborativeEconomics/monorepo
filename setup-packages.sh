#!/bin/bash

# Define the order of packages
packages=(
  "typescript-config"
  "types"
  "ipfs"
  "app-config"
  "database"
  "blockchain-tools"
  "hooks"
  "utils"
  "universe-api"
  "universe-components"
  "universe-pages"
)

# Loop through each package and run pnpm commands
for package in "${packages[@]}"; do
  echo "Processing $package..."
  cd "./packages/$package" || exit
  pnpm i
  pnpm build
  cd - || exit
done
