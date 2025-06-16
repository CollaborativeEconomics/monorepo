import { beforeAll, describe, expect, test } from "@jest/globals"

import { Triggers } from "@cfce/types"
import { setDateToReturnMockDate } from "../mocks/date"
import server from "../mocks/serverMock"
import runHook from "../runHook"

beforeAll(() => {
  process.env.CFCE_REGISTRY_API_KEY = "test-api-key"
  server.listen()
})

describe("runHook", () => {
  test("should execute a hook", async () => {
    const metadata = await runHook(
      Triggers.AddMetadataToNFTReceipt,
      "org_123",
      {
        userId: "1234",
        walletAddress: "0xABCD",
        walletAddressChain: "ETH",
        amountUSD: "20",
      },
    )
    const output = metadata.output as { walletAddress: string; tonsCO2: number }
    expect(output.walletAddress).toBe("0xABCD")
    expect(output.tonsCO2).toBeCloseTo(1, 0)
  })
  test("should execute a hook with multiple actions", async () => {
    const output = await runHook(Triggers.OnceDaily, "org_123", {
      userId: "1234",
      walletAddress: "0xABCD",
      walletAddressChain: "ETH",
      amountUSD: "20",
    })
    const createStories = output.createStories as unknown[]
    expect(createStories).toHaveLength(4)
  })
  test("stellar retirement hook works", async () => {
    setDateToReturnMockDate("2023-05-01")
    const output = await runHook(Triggers.OnceDaily, "stellar", {
      walletAddress: "GC53JCXZHW3SVNRE4CT6XFP46WX4ACFQU32P4PR3CU43OB7AKKMFXZ6Y",
    })
    const createStories = output.createStories as unknown[]
    expect(createStories).toHaveLength(1)
  })
})
