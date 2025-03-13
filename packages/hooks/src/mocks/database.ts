import { Triggers } from "../types"
import {
  addMetadataToNFTReceiptHook,
  onceDailyHook,
  stellarRetirementHook,
} from "./serverMock"

export const getHookByTriggerAndOrg = jest
  .fn()
  .mockImplementation((trigger: string, orgId: string) => {
    if (orgId === "stellar" && trigger === Triggers.onceDaily) {
      return Promise.resolve(stellarRetirementHook)
    }
    return Promise.resolve(
      trigger === Triggers.addMetadataToNFTReceipt
        ? addMetadataToNFTReceiptHook
        : onceDailyHook,
    )
  })
