import type { Prisma } from "@cfce/database"
import { expect, test } from "@playwright/test"

test.describe.configure({ mode: "serial" })

const headers = {
  "x-api-key": process.env.OFFICIAL_CFCE_API_KEY || "",
}
let organizationId = ""
let donationId = ""

test("Setup (create organization)", async ({ request, baseURL }) => {
  const response = await request.get(
    `${baseURL}/organizations?email=test@example.com`,
    {
      headers,
    },
  )
  console.log("response", response)
  if (response.status() !== 200) {
    return
  }
  const orgBody = await response.json()
  if (!orgBody?.data?.length) {
    // no test data, we can start fresh
    expect(orgBody.success).toBe(true)
    return
  }
  organizationId = orgBody.data[0].id
})

test("POST /donations", async ({ request, baseURL }) => {
  const data: Prisma.DonationCreateInput = {
    amount: 100,
    organization: {
      connect: {
        id: organizationId,
      },
    },
  }
  const response = await request.post(`${baseURL}/donations`, {
    headers,
    data,
  })
  console.log("response", response, data)
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
  donationId = body.data.id
})

test("GET /donations returns donations list", async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/donations`, {
    headers,
  })

  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
})

test("DELETE /donations/:id", async ({ request, baseURL }) => {
  const response = await request.delete(`${baseURL}/donations/${donationId}`, {
    headers,
  })

  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
})

test("Cleanup (delete organization)", async ({ request, baseURL }) => {
  // delete the organization
  const orgResponse = await request.delete(
    `${baseURL}/organizations/${organizationId}`,
    {
      headers,
    },
  )
  const orgDeleteBody = await orgResponse.json()
  expect(orgDeleteBody.success).toBe(true)
})
