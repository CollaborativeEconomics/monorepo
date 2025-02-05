"use server"
import "server-only"
import { type Prisma, type Donation, newDonation } from "@cfce/database"

export default async function createDonation(
  data: Prisma.DonationCreateInput,
) {
  try {
    const record = await newDonation(data)
    //console.log("CREATE DONATION", record)
    const plain = JSON.parse(JSON.stringify(record))
    return plain
  } catch (error) {
    console.log("DONATION ERROR", error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
