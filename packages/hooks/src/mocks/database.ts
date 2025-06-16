import { Triggers } from "@cfce/types"
import {
  addMetadataToNFTReceiptHook,
  onceDailyHook,
  stellarRetirementHook,
} from "./serverMock"

export const getHookByTriggerAndOrg = jest
  .fn()
  .mockImplementation((trigger: string, orgId: string) => {
    if (orgId === "stellar" && trigger === Triggers.OnceDaily) {
      return Promise.resolve(stellarRetirementHook)
    }
    return Promise.resolve(
      trigger === Triggers.AddMetadataToNFTReceipt
        ? addMetadataToNFTReceiptHook
        : onceDailyHook,
    )
  })
