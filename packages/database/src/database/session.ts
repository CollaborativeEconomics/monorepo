import prismaClient from "prisma/client"
import { Session } from "prisma/models"

export async function getSession(query): Promise<Session> {
  if(query?.token){
    const token   = query.token.toString()
    const where   = { sessionToken: token }
    const include = { user: true }
    const session = await prismaClient.Session.findUnique({ where, include })
    return session
  }
  return null
}

export async function newSession(data): Promise<Session> {
  let session = await prismaClient.Session.create({ data })
  console.log('NEW SESSION', session)
  return session
}

export async function deleteSession(query): Promise<Session> {
  if(query?.token){
    const token = query.token.toString()
    const session = await prismaClient.Session.delete({ where: { sessionToken: token } })
    return session
  }
  return null
}
