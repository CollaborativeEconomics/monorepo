import type { Prisma } from "@cfce/database"
import { expect, test } from "@playwright/test"

test.describe.configure({ mode: "serial" })

const headers = {
  "x-api-key": process.env.OFFICIAL_CFCE_API_KEY || "",
}

let storyId = ""
let storyLegacyId = ""
let initiativeId = ""
let organizationId = ""
let storyMediaId = ""

//#region Setup
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
//#endregion
//#region Organization
test("POST organization", async ({ request, baseURL }) => {
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
})

test("POST organization/[id]", async ({ request, baseURL }) => {
  const updatedData: Partial<Prisma.OrganizationUpdateInput> = {
    name: "Updated Test Organization",
  }
  const response = await request.post(
    `${baseURL}/organizations/${organizationId}`,
    {
      headers,
      data: updatedData,
    },
  )
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
  expect(body.data.name).toBe(updatedData.name)
})
//#endregion

//#region Initiative
test("POST initiative", async ({ request, baseURL }) => {
  const data: Prisma.InitiativeCreateInput = {
    slug: "test-initiative",
    title: "Test Initiative",
    description: "This is a test initiative",
    defaultAsset: "https://example.com/test.jpg",
    tag: 777,
    organization: {
      connect: {
        id: organizationId,
      },
    },
  }
  const response = await request.post(`${baseURL}/initiatives`, {
    headers,
    data,
  })
  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
  initiativeId = body.data.id
})

test("POST initiative/[id]", async ({ request, baseURL }) => {
  const updatedData: Partial<Prisma.InitiativeUpdateInput> = {
    title: "Updated Test Initiative",
  }
  const response = await request.post(
    `${baseURL}/initiatives/${initiativeId}`,
    {
      headers,
      data: updatedData,
    },
  )
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
  expect(body.data.title).toBe(updatedData.title)
})
//#endregion

//#region Story (legacy)
test("POST story legacy connection", async ({ request, baseURL }) => {
  const legacyData: Omit<
    Prisma.StoryCreateInput,
    "initiative" | "organization"
  > & {
    initiativeId: string
    organizationId: string
  } = {
    name: "Test Story Legacy",
    created: new Date(),
    description: "This is a test story",
    amount: 100,
    unitvalue: 1,
    unitlabel: "Test Unit Label",
    image: "https://example.com/test.jpg",
    initiativeId,
    organizationId,
  }
  const response = await request.post(`${baseURL}/stories`, {
    headers,
    data: legacyData,
  })
  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
  storyLegacyId = body.data.id
})
test("DELETE legacy story", async ({ request, baseURL }) => {
  await request.delete(`${baseURL}/stories/${storyLegacyId}`, {
    headers,
  })
})
//#endregion

//#region Story
test("POST story", async ({ request, baseURL }) => {
  const data: Prisma.StoryCreateInput = {
    name: "Test Story",
    created: new Date(),
    description: "This is a test story",
    amount: 100,
    unitvalue: 1,
    unitlabel: "Test Unit Label",
    image: "https://example.com/test.jpg",
    initiative: {
      connect: {
        id: initiativeId,
      },
    },
    organization: {
      connect: {
        id: organizationId,
      },
    },
    media: {
      create: [
        {
          media: "https://example.com/test.jpg",
        },
      ],
    },
  }
  const response = await request.post(`${baseURL}/stories`, {
    headers,
    data,
  })
  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
  storyId = body.data.id
})

test("POST story/[id]", async ({ request, baseURL }) => {
  const updatedData: Partial<Prisma.StoryUpdateInput> = {
    name: "Updated Test Story",
  }
  const response = await request.post(`${baseURL}/stories/${storyId}`, {
    headers,
    data: updatedData,
  })
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
  expect(body.data.name).toBe(updatedData.name)
})

test("POST storymedia", async ({ request, baseURL }) => {
  const data = {
    media: [
      {
        media: "https://example.com/test.jpg",
        mime: "image/jpeg",
      },
    ],
  }
  const response = await request.post(`${baseURL}/storymedia?id=${storyId}`, {
    headers,
    data,
  })
  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
  storyMediaId = body.data[0].id
})

test("GET storymedia by storyId", async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/storymedia?id=${storyId}`, {
    headers,
  })
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
  // one for the one created with the story, one for the one created in the test above
  expect(body.data.length).toBe(2)
})

test("DELETE storymedia", async ({ request, baseURL }) => {
  const response = await request.delete(
    `${baseURL}/storymedia/${storyMediaId}`,
    {
      headers,
    },
  )
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
})

test("DELETE story", async ({ request, baseURL }) => {
  const response = await request.delete(`${baseURL}/stories/${storyId}`, {
    headers,
  })
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
})
//#endregion
