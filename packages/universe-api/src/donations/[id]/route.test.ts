/** @jest-environment node */

import { type Donation, getDonations } from "@cfce/database"
import { DonationStatus } from "@cfce/types"
import Decimal from "decimal.js"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import checkApiKey from "../../checkApiKey"
import { DELETE, GET } from "./route"

// Mock the dependencies
jest.mock("@cfce/database")
jest.mock("../../checkApiKey")
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Headers()),
}))

const mockDonation: Donation = {
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
}

describe("Donation by ID API endpoint", () => {
  const mockGetDonations = getDonations as jest.MockedFunction<
    typeof getDonations
  >
  const mockCheckApiKey = checkApiKey as jest.MockedFunction<typeof checkApiKey>
  const mockHeaders = headers as jest.MockedFunction<typeof headers>

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders.mockImplementation(() =>
      Promise.resolve(new Headers({ "x-api-key": "valid-api-key" })),
    )
  })

  describe("GET /api/donations/[id]", () => {
    const createRequest = (id: string, apiKey?: string) => {
      const url = new URL(`http://localhost/api/donations/${id}`)
      url.searchParams.set("id", id)
      return new NextRequest(url, {
        headers: apiKey ? new Headers({ "x-api-key": apiKey }) : new Headers(),
      })
    }

    it("should return a donation when authorized", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetDonations.mockResolvedValue([mockDonation])

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      const serializedDonation = JSON.parse(JSON.stringify(mockDonation))
      expect(response.status).toBe(201)
      expect(data).toEqual({
        success: true,
        data: serializedDonation,
      })
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
      expect(mockGetDonations).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockCheckApiKey.mockResolvedValue(true)
      mockGetDonations.mockRejectedValue(new Error("Database error"))

      const request = createRequest("123", "valid-api-key")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
      })
    })
  })

  describe("DELETE /api/donations/[id]", () => {
    it("should return 400 Method Not Allowed", async () => {
      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        success: false,
        error: "Invalid HTTP method, only GET accepted",
      })
    })
  })
})
