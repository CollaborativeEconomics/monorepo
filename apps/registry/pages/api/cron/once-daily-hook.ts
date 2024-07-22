import { init, runHook, Triggers } from "@cfce/registry-hooks"
import { newCronjob } from "@cfce/database"
import { prepareDailyHook } from "@/lib/hooks/prepare"
import "@/lib/hooks/hookit"

export default async function handler(req, res) {
  const { method, headers } = req

  // Validate cron token from vercel
  const authorized =
    headers.authorization === `Bearer ${process.env.CRON_SECRET}`
  if (!authorized) {
    return res.status(401).json({ success: false, error: "Not authorized" })
  }

  const cronName = "once-daily-hook"

  switch (method) {
    case "GET":
      try {
        // Init hook library >> Moved to lib/hooks/hookit
        //init({
        //  registryApiKey: process.env.CFCE_REGISTRY_API_KEY,
        //  registryBaseUrl: process.env.CFCE_REGISTRY_API_URL
        //})

        // Run hook
        const { organizationId, walletAddress } = await prepareDailyHook()
        const result = await runHook(Triggers.onceDaily, organizationId, {
          walletAddress,
        })
        console.log("RES", result)

        // Save result to db
        const saved = await newCronjob({ cron: cronName, status: 1, result })
        res.json({ success: true })
      } catch (error) {
        // Save error to db
        console.log(error)
        const saved = await newCronjob({
          cron: cronName,
          status: 2,
          result: { error: error.message },
        })
        res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(405).json({ success: false, error: "Method not allowed" })
      break
  }
}
