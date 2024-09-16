import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = req.body

    if (!data.name) {
      return res.status(400).json({ success: false, error: "Name is required" })
    }
    if (!data.email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" })
    }

    try {
      // Simulate saving to the database
      console.log("Saving organization to database...", data)
      // Replace the following line with actual database save logic
      const result = { success: true }

      if (result.success) {
        return res.status(200).json({ success: true })
      } else {
        return res
          .status(500)
          .json({ success: false, error: "Error saving organization" })
      }
    } catch (ex) {
      console.error(ex)
      return res.status(500).json({ success: false, error: ex.message })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
