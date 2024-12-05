import type { Prisma } from "@cfce/database"
import { expect, test } from "@playwright/test"

test.describe.configure({ mode: "serial" })

const headers = {
  "x-api-key": process.env.OFFICIAL_CFCE_API_KEY || "",
}

let initiativeId = ""
let organizationId = ""

test("Setup (delete test data)", async ({ baseURL, request }) => {
  const response = await request.get(
    `${baseURL}/organizations?email=test@example.com`,
    {
      headers,
    },
  )
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

  const orgResponse = await request.delete(
    `${baseURL}/organizations/${organizationId}`,
    {
      headers,
    },
  )
  const orgDeleteBody = await orgResponse.json()
  expect(orgDeleteBody.success).toBe(true)
})
test("Create initiative", async ({ request, baseURL }) => {
  const data: Prisma.OrganizationCreateInput = {
    slug: "test-organization",
    name: "Test Organization",
    country: "US",
    description: "This is a test organization",
    email: "test@example.com",
  }
  const response = await request.post(`${baseURL}/organizations`, {
    headers,
    data,
  })
  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
  organizationId = body.data.id

  const initiativeData: Prisma.InitiativeCreateInput = {
    title: "Test Initiative",
    slug: "test-initiative",
    description: "This is a test initiative",
    defaultAsset: "img.png",
    tag: 1,
    organization: {
      connect: {
        id: organizationId,
      },
    },
  }
  const initiativeResponse = await request.post(`${baseURL}/initiatives`, {
    headers,
    data: initiativeData,
  })
  expect(initiativeResponse.status()).toBe(201)
  const initiativeBody = await initiativeResponse.json()
  expect(initiativeBody.success).toBe(true)
  initiativeId = initiativeBody.data.id
})
test("POST credit", async ({ request, baseURL }) => {
  const data: Prisma.CreditCreateInput = {
    type: "Biodiversity",
    description: "This is a test credit",
    currency: "USD",
    provider: {
      create: {
        name: "Test Provider",
        apiUrl: "https://test.com",
      },
    },
    initiative: {
      connect: {
        id: initiativeId,
      },
    },
  }
})
test("GET credit by initiative ID", async ({ request, baseURL }) => {
  const response = await request.get(
    `${baseURL}/credits?initiativeid=${initiativeId}`,
    {
      headers,
    },
  )
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
})
