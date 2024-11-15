/** @jest-environment node */

import { type Collection, getCollections, newCollection } from "@cfce/database"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../checkApiKey"
import { GET, POST } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}))

const mockCollections: Collection[] = [
  {
    id: "123",
    name: "Test Collection",
    description: "Test Description",
    created: new Date(),
    inactive: false,
    curated: false,
    authorId: "123",
    image: "",
    taxon: "Test Taxon",
    nftcount: 0,
  },
]

describe("Collections API endpoints", () => {
  const mockGetCollections = getCollections as jest.MockedFunction<
    typeof getCollections
  >
  const mockNewCollection = newCollection as jest.MockedFunction<
    typeof newCollection
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
  })

  describe("GET /api/collections", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/collections")
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          url.searchParams.set(key, value)
        })
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return collections when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCollections.mockResolvedValue(mockCollections)

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedCollections = JSON.parse(JSON.stringify(mockCollections))
      expect(response.status).toBe(201)
      expect(data).toEqual({
        success: true,
        data: serializedCollections,
      })
      expect(mockGetCollections).toHaveBeenCalledWith({})
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest({}, "invalid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
        error: "Not authorized",
      })
      expect(mockGetCollections).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCollections.mockResolvedValue(mockCollections)

      const query = { status: "active", title: "test" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(mockGetCollections).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCollections.mockRejectedValue(new Error("Database error"))

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

  describe("POST /api/collections", () => {
    const createRequest = (body: any, apiKey?: string) => {
      const url = new URL("http://localhost/api/collections")
      return new NextRequest(url, {
        method: "POST",
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
        body: JSON.stringify(body),
      })
    }

    it("should create a collection when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      const newCollectionData = {
        title: "New Collection",
        description: "New Description",
      }
      mockNewCollection.mockResolvedValue({
        ...mockCollections[0],
        ...newCollectionData,
      })

      const request = createRequest(newCollectionData, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(mockNewCollection).toHaveBeenCalledWith(newCollectionData)
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest({}, "invalid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
        error: "Not authorized",
      })
      expect(mockNewCollection).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewCollection.mockRejectedValue(new Error("Database error"))

      const request = createRequest({}, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Database error",
      })
    })
  })
})
