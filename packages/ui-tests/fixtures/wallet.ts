import type { Page } from "@playwright/test";
import { test as base } from "@playwright/test";
import { createClient, http, isAddress } from "viem";
import type { Address, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createConfig } from "wagmi";    
import { mainnet, foundry } from "wagmi/chains";
import { type MockParameters, mock } from "wagmi/connectors";

declare global {
    interface Window {
      _setupAccount: typeof createMockConfig;
    }
}

const chains = [mainnet, foundry] as const;

// export const config = createConfig({
//   chains,
//   client: ({ chain }) => createClient({ chain, transport: http() }),
//   connectors: [injected()],
//   ssr: true,
// });

export function createMockConfig(
  addressOrPkey: `0x${string}`,
  features?: MockParameters["features"]
) {
  const account = isAddress(addressOrPkey)
    ? addressOrPkey
    : privateKeyToAccount(addressOrPkey);
  const address = typeof account === "string" ? account : account.address;
  return createConfig({
    connectors: [mock({ accounts: [address], features })],
    chains,
    client: ({ chain }) => createClient({ 
      account, 
      chain,
      transport: http(),
      key: 'default',
    }),
    ssr: true,
  });
}

const ACCOUNT_PKEYS = {
  alice: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  bob: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
} as const;

export class WalletFixture {
  address?: Address;
  #page: Page;

  constructor({ page }: { page: Page }) {
    this.#page = page;
    // Instead of injecting the whole function, we'll inject a simpler version
    page.addInitScript(`
      window._setupAccount = function(address, features) {
        window.walletConfig = { address, features };
      };
    `);
    page.waitForFunction(() => typeof window._setupAccount === 'function');
  }

  async connect(
    name: keyof typeof ACCOUNT_PKEYS,
    features?: MockParameters["features"]
  ) {
    const pkey = ACCOUNT_PKEYS[name];
    const account = privateKeyToAccount(pkey);

    this.address = account.address;

    await this.#setup(pkey, features);
    await this.#login();
  }

  async #login() {
    return this.#page.getByRole("button", { name: "Sign In" }).click();
  }

//   async #setup(...args: [Hex, MockParameters["features"]]) {
//     // await this.#page.waitForFunction(() => window._setupAccount);
//     const account = isAddress(pkey) ? pkey : privateKeyToAccount(pkey);
//     const address = typeof account === "string" ? account : account.address;
//     await this.#page.evaluate(
//       ([addr, feat]) => window._setupAccount(addr, feat),
//       [address, features]
//     );
//     await this.#page.evaluate((args) => window._setupAccount(...args), args);
//   }
// }
async #setup(pkey: Hex, features?: MockParameters["features"]) {
    const account = isAddress(pkey) ? pkey : privateKeyToAccount(pkey);
    const address = typeof account === "string" ? account : account.address;
    await this.#page.evaluate(
      ([addr, feat]) => window._setupAccount(addr as `0x${string}`, features),
      [address, features]
    );
}
}

export const test = base.extend<{ wallet: WalletFixture }>({
  async wallet({ page }, use) {
    await use(new WalletFixture({ page }));
  },
});
