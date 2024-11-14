/** @jest-environment node */

import { type Artwork, getArtworks, newArtwork } from "@cfce/database"
import { NextRequest } from "next/server"
import { setDateToReturnMockDate } from "../__mocks__/mockDates"
import checkApiKey from "../checkApiKey"
import { DELETE, GET, POST } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")
setDateToReturnMockDate(new Date("2024-01-01"))

const mockArtwork: Artwork = {
  name: "Test Artwork",
  artwork: "test-artwork",
  id: "123",
  created: new Date(),
  inactive: false,
  tokenId: "123",
  authorId: "123",
  collectionId: "123",
  categoryId: "123",
  description: "Test Description",
  image: "test-image",
  metadata: "test-metadata",
  media: "test-media",
  beneficiaryId: "123",
  royalties: 100,
  tags: "test-tags",
  forsale: true,
  copies: 100,
  sold: 0,
  price: 100,
  likes: 0,
  views: 0,
}

describe("Artworks API endpoints", () => {
  const mockGetArtworks = getArtworks as jest.MockedFunction<typeof getArtworks>
  const mockNewArtwork = newArtwork as jest.MockedFunction<typeof newArtwork>
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/artworks", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/artworks")
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          url.searchParams.set(key, value)
        }
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return artworks when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetArtworks.mockResolvedValue([mockArtwork])

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedArtwork = JSON.parse(JSON.stringify([mockArtwork]))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedArtwork,
      })
      expect(mockGetArtworks).toHaveBeenCalledWith({})
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
      expect(mockGetArtworks).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetArtworks.mockResolvedValue([mockArtwork])

      const query = { category: "test", author: "123" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockGetArtworks).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetArtworks.mockRejectedValue(new Error("Database error"))

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

  describe("POST /api/artworks", () => {
    const createRequest = (body: Partial<Artwork>, apiKey?: string) => {
      return new NextRequest("http://localhost/api/artworks", {
        method: "POST",
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
        body: JSON.stringify(body),
      })
    }

    it("should create artwork when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewArtwork.mockResolvedValue(mockArtwork)

      const request = createRequest(mockArtwork, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      const serializedArtwork = JSON.parse(JSON.stringify(mockArtwork))
      expect(response.status).toBe(201)
      expect(data).toEqual({
        success: true,
        data: serializedArtwork,
      })
      expect(mockNewArtwork).toHaveBeenCalledWith(serializedArtwork)
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest(mockArtwork, "invalid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
        error: "Not authorized",
      })
      expect(mockNewArtwork).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewArtwork.mockRejectedValue(new Error("Database error"))

      const request = createRequest(mockArtwork, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Database error",
      })
    })
  })

  describe("DELETE /api/artworks", () => {
    it("should return 405 Method Not Allowed", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data).toEqual({
        success: false,
        error: "HTTP method not accepted",
      })
    })
  })
})
