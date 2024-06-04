import checkApiKey from "lib/checkApiKey"
import {newUser, getUsers} from "lib/database/users"

export default async function handler(req, res) {
  const { method, headers, query, body } = req
  console.log('enter')
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    console.log('noauth')
    return res.status(403).json({ success: false, error:'Not authorized' })
  }
  console.log('auth')
  switch (method) {
    case "GET":
      try {
        console.log('get', query)
        let result = await getUsers(query)
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        res.status(400).json({ success: false, error: error.message })
      }
      break
    case "POST":
      try {
        let record = body
        let result = await newUser(record)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not supported' })
      break
  }
}
