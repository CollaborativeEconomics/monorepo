import { unstable_getServerSession } from "next-auth"
import { v4 as uuidv4 } from "uuid"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { setUser } from "@cfce/database"

export default async function handler(req, res) {
  const { method } = req
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions)

  switch (method) {
    case "PUT":
      console.log({ method, user: session.user })
      try {
        const {
          // @ts-ignore
          user: { id: userId },
        } = session
        const apiKey = uuidv4()
        const data = { api_key: apiKey }
        const result = await setUser(userId, data).catch(console.warn)
        console.log({ userId, data, result })
        res.status(201).json({ success: true, data: result })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
