import { expect, test } from "@playwright/test"

test("GET /donations returns donations list", async ({ request, baseURL }) => {
  console.log("OFFICIAL_CFCE_API_KEY", process.env.OFFICIAL_CFCE_API_KEY)
  const response = await request.get(`${baseURL}/donations`, {
    headers: {
      "x-api-key": process.env.OFFICIAL_CFCE_API_KEY || "",
    },
  })

  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.success).toBe(true)
})

test("POST /donations creates a new donation", async ({ request, baseURL }) => {
  const response = await request.post(`${baseURL}/donations`, {
    headers: {
      "x-api-key": process.env.OFFICIAL_CFCE_API_KEY || "",
    },
    data: {
      amount: 100,
      currency: "USD",
    },
  })

  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.success).toBe(true)
})
