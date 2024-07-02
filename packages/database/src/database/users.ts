import prismaClient from "prisma/client"
import { User } from "prisma/models"

export async function getUsers(query): Promise<User | Array<User>> {
  console.log('QUERY', query)
  let data = null
  let unique = true
  let first = false
  let where = {}
  let include = {
    artworks: {
      include: { author: true }
    },
    collections: true,
    wallets: true
  }

  if(query?.email){
    const email = query.email.toString()
    const user = await prismaClient.User.findUnique({ where: { email } })
    return user
  }

  if (query?.name) {
    where = { name: query.name }
  } else if (query?.wallet) {
    const address = query.wallet.toString()
    where = { 
      wallets: {
        some: {
          address: {
            equals: address,
            mode: 'insensitive'
          }
        }
      }
    }
    unique = false // wallet should be @unique, use findFirst 
    first = true
  } else if (query?.apikey) {
    where = { api_key: query.apikey }
  } else {
    unique = false
  }

  if (unique) {
    data = await prismaClient.User.findUnique({ where, include })
  } else if (first) {
    console.log('WALLET', JSON.stringify(where))
    data = await prismaClient.User.findFirst({ where, include })
  } else {
    data = await prismaClient.User.findMany({ where, include })
  }

  return data
}

export async function newUser(data): Promise<User> {
  let user = await prismaClient.User.create({ data })
  console.log('NEW', user)
  return user
}

export async function setUser(id, data): Promise<User> {
  let user = await prismaClient.User.update({ where: { id }, data })
  console.log('SET', user)
  return user
}

export async function getUser(id): Promise<User> {
  const include = {
    artworks: {
      include: { author: true }
    },
    collections: true,
    wallets: true
  }
  const user = await prismaClient.User.findUnique({ where: { id }, include })
  console.log('GET', user)
  return user
}

export async function getUserByEmail(email): Promise<User> {
  const user = await prismaClient.User.findUnique({ where: { email } })
  return user
}

