import { test as base } from "@playwright/test";
import { createTestClient, http, publicActions, walletActions } from "viem";
import { foundry } from "viem/chains";

const anvil = createTestClient({
  chain: foundry,
  mode: "anvil",
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions)
  .extend((client) => ({
    async syncDate(date: Date) {
      await client.setNextBlockTimestamp({
        timestamp: BigInt(Math.round(date.getTime() / 1000)),
      });
      return client.mine({ blocks: 1 });
    },
  }));

export const test = base.extend<{ anvil: typeof anvil }>({
  // eslint-disable-next-line no-empty-pattern
  // biome-ignore lint/correctness/noEmptyPattern: <explanation>
    async anvil({}, use) {
    await use(anvil);
  },
});
