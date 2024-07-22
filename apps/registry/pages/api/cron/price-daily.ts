import { newCronjob } from "@cfce/database"

export default async function handler(req, res) {
  const { method, headers } = req
  // Validate cron token from vercel
  const authorized =
    headers.authorization === `Bearer ${process.env.CRON_SECRET}`
  if (!authorized) {
    return res.status(401).json({ success: false, error: "Not authorized" })
  }

  switch (method) {
    case "GET":
      try {
        // Test error
        // throw Error('Something went wrong')
        // Do stuff
        const price = (Math.random() * 100).toFixed(2)
        // Save result to db
        const saved = await newCronjob({
          cron: "price-daily",
          status: 1,
          result: { price },
        })
        res.json({ success: true, price })
      } catch (error) {
        console.log(error)
        // Save error to db
        const saved = await newCronjob({
          cron: "price-daily",
          status: 2,
          result: { error: error.message },
        })
        res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(500).json({ success: false, error: "Method not allowed" })
      break
  }
}
