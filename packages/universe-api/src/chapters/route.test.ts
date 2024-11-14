/** @jest-environment node */

import { type Chapter, getChapters, newChapter } from "@cfce/database"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../checkApiKey"
import { GET, POST } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({
    get: (key: string) => (key === "x-api-key" ? "valid-api-key" : null),
  })),
}))

const mockChapter: Chapter = {
  id: "123",
  name: "Test Chapter",
  description: "Test Description",
  location: "Test Location",
  created: new Date(),
  inactive: false,
  slug: "test-chapter",
}

const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {})

describe("Chapters API endpoints", () => {
  const mockGetChapters = getChapters as jest.MockedFunction<typeof getChapters>
  const mockNewChapter = newChapter as jest.MockedFunction<typeof newChapter>
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
    mockConsoleError.mockClear()
  })

  describe("GET /api/chapters", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/chapters")
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          url.searchParams.set(key, value)
        }
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return chapters when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetChapters.mockResolvedValue([mockChapter])

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedChapters = JSON.parse(JSON.stringify([mockChapter]))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedChapters,
      })
      expect(mockGetChapters).toHaveBeenCalledWith({})
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
      expect(mockGetChapters).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetChapters.mockResolvedValue([mockChapter])

      const query = { inactive: "false", name: "test" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockGetChapters).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetChapters.mockRejectedValue(new Error("Database error"))

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
      })
    })
  })

  describe("POST /api/chapters", () => {
    const createRequest = (body: Partial<Chapter>, apiKey?: string) => {
      return new NextRequest("http://localhost/api/chapters", {
        method: "POST",
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
        body: JSON.stringify(body),
      })
    }

    it("should create chapter when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewChapter.mockResolvedValue(mockChapter)

      const request = createRequest(mockChapter, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      const serializedChapter = JSON.parse(JSON.stringify(mockChapter))
      expect(response.status).toBe(201)
      expect(data).toEqual({
        success: true,
        data: serializedChapter,
      })
      expect(mockNewChapter).toHaveBeenCalledWith(serializedChapter)
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest(mockChapter, "invalid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
      })
      expect(mockNewChapter).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewChapter.mockRejectedValue(new Error("Database error"))

      const request = createRequest(mockChapter, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
      })
    })
  })
})
