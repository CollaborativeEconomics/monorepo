import type { ActionParams as ActionParamsType } from "@cfce/types"

declare global {
  namespace PrismaJson {
    type ActionParams = ActionParamsType
  }
}