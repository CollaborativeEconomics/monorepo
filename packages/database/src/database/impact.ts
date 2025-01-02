import { sql } from "@vercel/postgres"

// ONE TO ONE
export async function updateStoryLink(
  initiativeId: string,
  storyId: string,
  amount: string,
) {
  const res =
    await sql`UPDATE donations SET "storyId" = ${storyId}, status=3 WHERE _id IN (
                          SELECT _id FROM (
                            SELECT _id, created, (
                              SELECT sum(amount) FROM donations WHERE "initiativeId" = ${initiativeId} AND created <= D.created AND "storyId" IS NULL
                            ) as totals FROM donations D WHERE "initiativeId" = ${initiativeId} AND "storyId" IS NULL
                          ) as T WHERE totals <= ${amount} ORDER BY created
                        )`
  console.log("SQL", res)
  return res
}

// ONE TO MANY
export async function updateImpactLink(
  initiativeId: string,
  storyId: string,
  amount: string,
) {
  const res = await sql`INSERT INTO impactlink(storyid, donationid, amount)
                          SELECT ${storyId} as storyid, _id as donationid, usdvalue as amount FROM donations WHERE _id in (
                            SELECT _id FROM (
                              SELECT _id, created, (
                                SELECT sum(amount) FROM donations WHERE "initiativeId" = ${initiativeId} AND created <= d.created AND "storyId" IS NULL
                              ) as totals FROM donations d WHERE "initiativeId" = ${initiativeId} AND "storyId" IS NULL
                            ) as t WHERE totals <= ${amount} ORDER BY created
                          )
                        `
  console.log("SQL", res)
  return res
}
