import type { Prisma } from "@cfce/database"
import { expect, test } from "@playwright/test"

const headers = {
  "x-api-key": process.env.OFFICIAL_CFCE_API_KEY || "",
}
let orgId = ""
let donationId = ""

test.beforeAll(async ({ request, baseURL }) => {
  const orgResponse = await request.get(`${baseURL}/organizations`, {
    headers,
  })
  expect(orgResponse.status()).toBe(200)

  const orgs = await orgResponse.json()
  expect(orgs.data.length).toBeGreaterThan(0)
  orgId = orgs.data[0].id
})
test.afterAll(async ({ request, baseURL }) => {
  // delete the organization
  await request.delete(`${baseURL}/organizations/${orgId}`, {
    headers,
  })
})

test("GET /donations returns donations list", async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/donations`, {
    headers,
  })

  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
})

test("Donation creation and deletion", async ({ request, baseURL }) => {
  await test.step("Create a donation", async () => {
    const data: Prisma.DonationCreateInput = {
      amount: 100,
      organization: {
        connect: {
          id: orgId,
        },
      },
    }
    const response = await request.post(`${baseURL}/donations`, {
      headers,
      data,
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    donationId = body.data.id
  })

  await test.step("Delete the donation", async () => {
    const response = await request.delete(
      `${baseURL}/donations/${donationId}`,
      {
        headers,
      },
    )

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
  })
})
