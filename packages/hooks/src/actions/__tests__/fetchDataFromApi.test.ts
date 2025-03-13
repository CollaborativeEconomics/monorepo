import { describe, expect, test } from "@jest/globals"
// import server from "../../mocks/serverMock"

describe("fetchDataFromApi", () => {
  test("fetches data from the API", async () => {
    const response = await fetch("https://registry.cfce.io/api/test")
    const data = await response.json()
    expect(data).toEqual({ message: "Hello test!" })
  })
})
