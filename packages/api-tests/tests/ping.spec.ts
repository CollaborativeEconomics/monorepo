import { expect, test } from "@playwright/test"

test("ping endpoint returns pong", async ({ request, baseURL }) => {
  // Make a GET request to the ping endpoint
  const response = await request.get(`${baseURL}/ping`)

  // Verify the response status is 200
  expect(response.status()).toBe(200)

  // Verify the response body contains the expected message
  const body = await response.json()
  expect(body).toEqual({ message: "pong" })
})
