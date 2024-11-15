/** @jest-environment node */

import { type Cronjob, getCronjobs } from "@cfce/database"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../checkApiKey"
import { DELETE, GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}))

const mockCronjobs: Cronjob[] = [
  {
    id: "123",
    created: new Date(),
    cron: "0 0 * * *",
    status: 1,
    result: {},
  },
]

describe("Cronjobs API endpoints", () => {
  const mockGetCronjobs = getCronjobs as jest.MockedFunction<typeof getCronjobs>
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
  })

  describe("GET /api/cronjobs", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/cronjobs")
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          url.searchParams.set(key, value)
        }
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return cronjobs when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCronjobs.mockResolvedValue(mockCronjobs)

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedCronjobs = JSON.parse(JSON.stringify(mockCronjobs))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedCronjobs,
      })
      expect(mockGetCronjobs).toHaveBeenCalledWith({})
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
      expect(mockGetCronjobs).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCronjobs.mockResolvedValue(mockCronjobs)

      const query = { status: "completed" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockGetCronjobs).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCronjobs.mockRejectedValue(new Error("Database error"))

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

  describe("DELETE /api/cronjobs", () => {
    it("should return 405 Method Not Allowed", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data).toEqual({
        success: false,
        error: "Method not allowed",
      })
    })
  })
})
