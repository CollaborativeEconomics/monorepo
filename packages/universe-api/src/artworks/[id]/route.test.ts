/** @jest-environment node */

import { type Artwork, getArtworkById } from "@cfce/database"
import { NextRequest } from "next/server"
import checkApiKey from "../../checkApiKey"
import { DELETE, GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../../checkApiKey")

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

describe("Artwork API endpoints", () => {
  const mockGetArtworkById = getArtworkById as jest.MockedFunction<
    typeof getArtworkById
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/artworks/[id]", () => {
    const createRequest = (id?: string, apiKey?: string) => {
      const url = new URL(`http://localhost/api/artworks/${id || ""}`)
      if (id) url.searchParams.set("id", id)

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return artwork when authorized and valid ID provided", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetArtworkById.mockResolvedValue(mockArtwork)

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: mockArtwork,
      })
      expect(mockGetArtworkById).toHaveBeenCalledWith("123")
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
      expect(mockGetArtworkById).not.toHaveBeenCalled()
    })

    it("should return 400 when no ID provided", async () => {
      mockCheckApiKey.mockResolvedValue(true)

      const request = createRequest(undefined, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Artwork ID required",
      })
      expect(mockGetArtworkById).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetArtworkById.mockRejectedValue(new Error("Database error"))

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

  describe("DELETE /api/artworks/[id]", () => {
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
