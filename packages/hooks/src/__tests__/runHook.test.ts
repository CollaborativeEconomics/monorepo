import { expect, test, describe } from "bun:test";

import runHook from "../runHook";
import server from "../../mocks/serverMock";
import { Triggers } from "../types";
import { setDateToReturnMockDate } from "../../mocks/date";

describe("runHook", () => {
  test("should execute a hook", async () => {
    const metadata = await runHook(Triggers.addMetadataToNFTReceipt, "org_123", {
      userId: '1234',
      walletAddress: '0xABCD',
      walletAddressChain: "ETH",
      amountUSD: '20'
    });
    expect(metadata.output).toMatchObject({ tonsCO2: 1, walletAddress: '0xABCD' });
  });
  test("should execute a hook with multiple actions", async () => {
    const output = await runHook(Triggers.onceDaily, "org_123", { userId: '1234', walletAddress: '0xABCD', walletAddressChain: "ETH", amountUSD: '20' });
    expect(output.createStories).toHaveLength(4)
  })
  test("stellar retirement hook works", async () => {
    setDateToReturnMockDate('2023-05-01');
    const output = await runHook(Triggers.onceDaily, "stellar", { walletAddress: 'GC53JCXZHW3SVNRE4CT6XFP46WX4ACFQU32P4PR3CU43OB7AKKMFXZ6Y' });
    expect(output.createStories).toHaveLength(1)
  })
});