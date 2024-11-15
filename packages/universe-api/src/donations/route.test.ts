/** @jest-environment node */

import { type Donation, getDonations, newDonation } from "@cfce/database"
import { DonationStatus } from "@cfce/types"
import Decimal from "decimal.js"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../checkApiKey"
import { DELETE, GET, POST } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}))

const mockDonations: Donation[] = [
  {
    id: "123",
    amount: new Decimal(100),
    status: DonationStatus.pending,
    created: new Date(),
    userId: "user123",
    organizationId: "org123",
    chapterId: null,
    initiativeId: null,
    paytype: null,
    network: null,
    storyId: null,
    categoryId: null,
    chain: null,
    issuer: null,
    wallet: null,
    usdvalue: new Decimal(0),
    asset: null,
  },
]

describe("Donations API endpoints", () => {
  const mockGetDonations = getDonations as jest.MockedFunction<
    typeof getDonations
  >
  const mockNewDonation = newDonation as jest.MockedFunction<typeof newDonation>
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
  })

  describe("GET /api/donations", () => {
    const createRequest = (query?: Record<string, string>, apiKey?: string) => {
      const url = new URL("http://localhost/api/donations")
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          url.searchParams.set(key, value)
        }
      }

      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return donations when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetDonations.mockResolvedValue(mockDonations)

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedDonations = JSON.parse(JSON.stringify(mockDonations))
      expect(response.status).toBe(201)
      expect(data).toEqual({
        success: true,
        data: serializedDonations,
      })
      expect(mockGetDonations).toHaveBeenCalledWith({})
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
      expect(mockGetDonations).not.toHaveBeenCalled()
    })

    it("should handle query parameters", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetDonations.mockResolvedValue(mockDonations)

      const query = { status: "completed", donorId: "donor123" }
      const request = createRequest(query, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(mockGetDonations).toHaveBeenCalledWith(query)
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetDonations.mockRejectedValue(new Error("Database error"))

      const request = createRequest({}, "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
      })
    })
  })

  describe("POST /api/donations", () => {
    const createRequest = (body: Partial<Donation>, apiKey?: string) => {
      const url = new URL("http://localhost/api/donations")
      return new NextRequest(url, {
        method: "POST",
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
        body: JSON.stringify(body),
      })
    }

    it("should create a donation when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      const newDonationData = {
        amount: 50,
        currency: "EUR",
        donorId: "donor456",
        projectId: "project456",
      }
      mockNewDonation.mockResolvedValue({
        ...mockDonations[0],
        ...newDonationData,
      })

      const request = createRequest(newDonationData, "valid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockNewDonation).toHaveBeenCalledWith(newDonationData)
    })

    it("should return 403 when unauthorized", async () => {
      mockCheckApiKey.mockResolvedValue(false)

      const request = createRequest({}, "invalid-api-key")
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
      })
      expect(mockNewDonation).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockNewDonation.mockRejectedValue(new Error("Database error"))

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

  describe("DELETE /api/donations", () => {
    it("should return 400 Method Not Allowed", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Invalid HTTP method, only GET and POST accepted",
      })
    })
  })
})
