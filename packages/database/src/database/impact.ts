import { sql } from '@vercel/postgres'

interface DataLink {
  initiativeId: string
  storyId: string
  amount: number
}

// ONE TO ONE
export async function updateStoryLink(link:DataLink){
  const res = await sql`UPDATE donations SET "storyId" = ${link.storyId}, status=3 WHERE _id IN (
                          SELECT _id FROM (
                            SELECT _id, created, (
                              SELECT sum(usdvalue) FROM donations WHERE "initiativeId" = ${link.initiativeId} AND created <= D.created AND "storyId" IS NULL
                            ) as totals FROM donations D WHERE "initiativeId" = ${link.initiativeId} AND "storyId" IS NULL
                          ) as T WHERE totals <= ${link.amount} ORDER BY created
                        )`
  //console.log('SQL', res)
  return res
}

// ONE TO MANY
export async function updateImpactLink(link:DataLink){
  const res = await sql`INSERT INTO impactlink(storyid, donationid, amount)
                          SELECT ${link.storyId} as storyid, _id as donationid, usdvalue as amount FROM donations WHERE _id in (
                            SELECT _id FROM (
                              SELECT _id, created, (
                                SELECT sum(usdvalue) FROM donations WHERE "initiativeId" = ${link.initiativeId} AND created <= d.created AND "storyId" IS NULL
                              ) as totals FROM donations d WHERE "initiativeId" = ${link.initiativeId} AND "storyId" IS NULL
                            ) as t WHERE totals <= ${link.amount} ORDER BY created
                          )
                        `
  //console.log('SQL', res)
  return res
}
