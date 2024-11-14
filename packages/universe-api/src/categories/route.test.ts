/** @jest-environment node */

import { type Category, getCategories } from "@cfce/database"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../checkApiKey"
import { GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}))

const mockCategories: Category[] = [
  {
    id: "123",
    slug: "test-category",
    color: "#000000",
    title: "Test Category",
    description: "Test Description",
    image: null,
  },
]

describe("Categories API endpoints", () => {
  const mockGetCategories = getCategories as jest.MockedFunction<
    typeof getCategories
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    // Set up default mock for headers
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
  })

  describe("GET /api/categories", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/categories")
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          url.searchParams.set(key, value)
        }
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return categories when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCategories.mockResolvedValue(mockCategories)

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedCategories = JSON.parse(JSON.stringify(mockCategories))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedCategories,
      })
      expect(mockGetCategories).toHaveBeenCalledWith({})
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
      expect(mockGetCategories).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCategories.mockResolvedValue(mockCategories)

      const query = { inactive: "false", name: "test" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockGetCategories).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCategories.mockRejectedValue(new Error("Database error"))

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
      })
    })
  })
})
