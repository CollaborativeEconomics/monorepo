import { handlers } from "@cfce/auth"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export const { 
    GET, 
    POST 
  } = handlers
