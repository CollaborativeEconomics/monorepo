import { Session, prismaClient } from "index"
import { ListQuery } from "types"

interface SessionQuery extends ListQuery {
  token?: string
}

export async function getSession(query: SessionQuery): Promise<Session | null> {
  if (query?.token) {
    const token = query.token.toString()
    const where = { sessionToken: token }
    const include = { user: true }
    const session = await prismaClient.session.findUnique({ where, include })
    return session
  }
  return null
}

export async function newSession(data: Session): Promise<Session> {
  let session = await prismaClient.session.create({ data })
  console.log('NEW SESSION', session)
  return session
}

export async function deleteSession(query: { token: string }): Promise<Session | null> {
  if (query?.token) {
    const token = query.token.toString()
    const session = await prismaClient.session.delete({ where: { sessionToken: token } })
    return session
  }
  return null
}
