/** @jest-environment node */

import { type Chapter, getChapterById } from "@cfce/database"
import { NextRequest } from "next/server"
import checkApiKey from "../../checkApiKey"
import { GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../../checkApiKey")

const mockChapter: Chapter = {
  id: "123",
  name: "Test Chapter",
  description: "Test Description",
  location: "Test Location",
  created: new Date(),
  inactive: false,
  slug: "test-chapter",
}

describe("Chapter [id] API endpoints", () => {
  const mockGetChapterById = getChapterById as jest.MockedFunction<
    typeof getChapterById
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/chapters/[id]", () => {
    const createRequest = (id?: string, apiKey?: string) => {
      const url = new URL("http://localhost/api/chapters/123")
      if (id) {
        url.searchParams.set("id", id)
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return chapter when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetChapterById.mockResolvedValue(mockChapter)

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedChapter = JSON.parse(JSON.stringify(mockChapter))
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: serializedChapter,
      })
      expect(mockGetChapterById).toHaveBeenCalledWith("123")
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
      expect(mockGetChapterById).not.toHaveBeenCalled()
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
      expect(mockGetChapterById).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetChapterById.mockRejectedValue(new Error("Database error"))

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
