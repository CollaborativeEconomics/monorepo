/** @jest-environment node */

import { type Collection, getCollectionById } from "@cfce/database"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../../checkApiKey"
import { GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}))

const mockCollection: Collection = {
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
}

describe("Collection by ID API endpoint", () => {
  const mockGetCollectionById = getCollectionById as jest.MockedFunction<
    typeof getCollectionById
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
  })

  describe("GET /api/collections/[id]", () => {
    const createRequest = (id: string, apiKey?: string) => {
      const url = new URL(`http://localhost/api/collections/${id}`)
      url.searchParams.set("id", id)
      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return a collection when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCollectionById.mockResolvedValue(mockCollection)

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedCollection = JSON.parse(JSON.stringify(mockCollection))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedCollection,
      })
      expect(mockGetCollectionById).toHaveBeenCalledWith("123")
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest("123", "invalid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
        error: "Not authorized",
      })
      expect(mockGetCollectionById).not.toHaveBeenCalled()
    })

    it("should return 400 when id is missing", async () => {
      mockCheckApiKey.mockResolvedValue(true)

      const url = new URL("http://localhost/api/collections/123")
      const request = new NextRequest(url, {
        headers: new Headers({ "x-api-key": "valid-api-key" }),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Missing id",
      })
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetCollectionById.mockRejectedValue(new Error("Database error"))

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Database error",
      })
    })
  })
})
