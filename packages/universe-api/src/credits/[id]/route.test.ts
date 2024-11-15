/** @jest-environment node */

import { type Credit, getCreditById } from "@cfce/database"
import { Decimal } from "decimal.js"
import { NextRequest } from "next/server"
import checkApiKey from "../../checkApiKey"
import { GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../../checkApiKey")

const mockCredit: Credit = {
  id: "123",
  providerId: "123",
  initiativeId: "123",
  type: "None",
  description: "Test Description",
  currency: "USD",
  value: new Decimal(100),
  start: new Date(),
  finish: null,
  filled: false,
  current: null,
  goal: null,
}

describe("Credit [id] API endpoints", () => {
  const mockGetCreditById = getCreditById as jest.MockedFunction<
    typeof getCreditById
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/credits/[id]", () => {
    const createRequest = (id?: string, apiKey?: string) => {
      const url = new URL("http://localhost/api/credits/123")
      if (id) {
        url.searchParams.set("id", id)
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return credit when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCreditById.mockResolvedValue(mockCredit)

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedCredit = JSON.parse(JSON.stringify(mockCredit))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedCredit,
      })
      expect(mockGetCreditById).toHaveBeenCalledWith("123")
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest("123", "invalid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
      })
      expect(mockGetCreditById).not.toHaveBeenCalled()
    })

    it("should return 400 when id is missing", async () => {
      mockCheckApiKey.mockResolvedValue(true)

      const request = createRequest(undefined, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Missing id",
      })
      expect(mockGetCreditById).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCreditById.mockRejectedValue(new Error("Database error"))

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
      })
    })
  })
})
