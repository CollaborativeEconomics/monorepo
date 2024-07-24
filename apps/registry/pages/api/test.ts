import { sql } from "@vercel/postgres"

export async function showTables() {
  const { rows } = await sql`
    SELECT tablename 
    FROM pg_catalog.pg_tables 
    WHERE schemaname != 'pg_catalog' 
    AND schemaname != 'information_schema'
    ORDER BY tablename
  `
  const list = rows.map((row) => row.tablename)
  return list
}

//import { Prisma } from '@prisma/client'
//import db from "prisma/client"
//import * as migrate from 'lib/database/db-migrate'
//import {getUsers} from 'lib/database/users'
//import {newWallet} from 'lib/database/userwallets'
//import {getCategories} from "lib/database/categories"
//import {getOrganizations} from "lib/database/organizations"
//import {getNftData} from "lib/database/nftData"
//import {getNFTbyTokenId} from "lib/database/nftData"
//import {getArtworkById} from "lib/database/artworks"
//import {deleteAll} from "lib/database/nftData"
//import {getStoryById} from "lib/database/stories"
//import {getInitiatives} from "lib/database/initiatives"
//import {getProviders} from "lib/database/providers"
//import {getCredits} from "lib/database/credits"
//import {getWallets} from "lib/database/wallets"
//import {getWallets} from "lib/database/userwallets"
//import {getStories} from "lib/database/stories"
//import {getDonations} from "lib/database/donations"

//console.log('DMMF', Prisma.dmmf)
//console.log('DATA', Prisma.dmmf.datamodel)
//console.log('MDLS', Prisma.dmmf.datamodel.models)

export default async function test(req, res) {
  console.log("> api/test")
  const info = await showTables()
  //const info = Prisma.dmmf.datamodel.models.find(model => model.name === "Account").fields
  //const info = Prisma.dmmf.datamodel.models.find(model => model.name === "Organization").fields
  //const info = Prisma.dmmf.datamodel.models.find(model => model.name === "User").fields

  //const info = db.NFTData.deleteMany({})
  //const info = await db.User.findUnique({ where: { id:'6376395c4cbe86f440764d3f' }, include:{wallets:true} }) //  rhjqL5YcMBZWQbQmFE9XxQHTWX6qNim3T1
  //const info = await db.Initiative.updateMany({data:{goal:0, donations:0, lastmonth:0}})
  /*
  const info = await db.User.findFirst({ 
    where: { 
      wallets: {
        some:{
          address:{
            equals:'rhjqL5YcMBZWQbQmFE9XxQHTWX6qNim3T1',
            mode:'insensitive'
          }
        }
      } 
    },
    include: { wallets:true }
  })
  */
  //const info = await getUsers()
  //const info = await newWallet({userId:'cabac26f-b9df-45bf-9cd2-f898334d3fdf', address:'GAPGZM2MKJP4PUTMRT3BXI2GJJH5Z3Z7G7OQSCHE3QS3LB57AUVCOAID', chain:'Stellar'})
  //const info = await getUsers({wallet:'rhjqL5YcMBZWQbQmFE9XxQHTWX6qNim3T1'})
  //const info = await getNftData({userId:'6376395c4cbe86f440764d3f'})
  //const info = await getNftData({address:'rhjqL5YcMBZWQbQmFE9XxQHTWX6qNim3T1'})
  //const info = await getArtworkById('64e2263a2975845e92427346')
  //const info = await deleteAllNFTs()
  //const info = await getStoryById('649b4f8dba097b20821c0a07')
  //const info = await getInitiatives()
  //const info = await getCategories()
  //const info = await getOrganizations()
  //const info = await getProviders()
  //const info = await getCredits()
  //const info = await getWallets()
  //const info = await getWallets() // userwallets
  //const info = await getStories()
  //const info = await getDonations()
  //const info = await migrate.insertStories()
  //const info = null;
  res
    .status(200)
    .setHeader("Content-Type", "text/plain")
    .send(JSON.stringify(info || null, null, 2))
}
