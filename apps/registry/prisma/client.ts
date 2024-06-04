import { PrismaClient } from '@prisma/client'

let prismaClient

//check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient()
} else {
  //check if there is already a connection to the database
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient()
  }
  prismaClient = global.prismaClient
}

export default prismaClient