/** @jest-environment node */

import { type Credit, getCredits, newCredit } from "@cfce/database"
import { Decimal } from "decimal.js"
import { NextRequest } from "next/server"
import checkApiKey from "../checkApiKey"
import { DELETE, GET, POST } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")

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

describe("Credits API endpoints", () => {
  const mockGetCredits = getCredits as jest.MockedFunction<typeof getCredits>
  const mockNewCredit = newCredit as jest.MockedFunction<typeof newCredit>
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/credits", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/credits")
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          url.searchParams.set(key, value)
        }
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return credits when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCredits.mockResolvedValue([mockCredit])

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedCredits = JSON.parse(JSON.stringify([mockCredit]))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedCredits,
      })
      expect(mockGetCredits).toHaveBeenCalledWith({})
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest({}, "invalid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
      })
      expect(mockGetCredits).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCredits.mockResolvedValue([mockCredit])

      const query = { inactive: "false", name: "test" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockGetCredits).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCredits.mockRejectedValue(new Error("Database error"))

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Database error",
      })
    })
  })

  describe("POST /api/credits", () => {
    const createRequest = (body: Partial<Credit>, apiKey?: string) => {
      return new NextRequest("http://localhost/api/credits", {
        method: "POST",
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
        body: JSON.stringify(body),
      })
    }

    it("should create credit when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewCredit.mockResolvedValue(mockCredit)

      const request = createRequest(mockCredit, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      const serializedCredit = JSON.parse(JSON.stringify(mockCredit))
      expect(response.status).toBe(201)
      expect(data).toEqual({
        success: true,
        data: serializedCredit,
      })
      expect(mockNewCredit).toHaveBeenCalledWith(serializedCredit)
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest(mockCredit, "invalid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
      })
      expect(mockNewCredit).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewCredit.mockRejectedValue(new Error("Database error"))

      const request = createRequest(mockCredit, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Database error",
      })
    })
  })

  describe("DELETE /api/credits", () => {
    it("should return 405 Method Not Allowed", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data).toEqual({
        success: false,
        message: "Method Not Allowed",
      })
    })
  })
})
