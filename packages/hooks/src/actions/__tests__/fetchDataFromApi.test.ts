import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals"
import { http, HttpResponse } from "msw"
import server from "../../mocks/serverMock"

// Start server before all tests
beforeAll(() => server.listen())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())

describe("fetchDataFromApi", () => {
  test("fetches data from the API", async () => {
    // Set up the mock response
    server.use(
      http.get("https://registry.cfce.io/api/test", () => {
        return HttpResponse.json({ message: "Hello test!" })
      }),
    )

    const response = await fetch("https://registry.cfce.io/api/test")
    const data = await response.json()
    expect(data).toEqual({ message: "Hello test!" })
  })
})
