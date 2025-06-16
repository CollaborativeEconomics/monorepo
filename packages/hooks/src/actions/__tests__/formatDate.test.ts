import { describe, expect, test } from "@jest/globals"
import { setDateToReturnMockDate } from "../../mocks/date"
import formatDate from "../formatDate"

describe("formatDate action", () => {
  beforeEach(() => {
    setDateToReturnMockDate("2023-03-02")
  })

  test("formats date timestamp", async () => {
    const result = await formatDate(
      {},
      { inputDate: Date.now(), format: "yyyy-MM-dd" },
    )
    expect(result).toEqual("2023-03-02")
  })
  test("formats date string", async () => {
    const result = await formatDate(
      {},
      { inputDate: "2023-03-02", format: "d/M/yyyy" },
    )
    expect(result).toEqual("2/3/2023")
  })
  test("formats date object", async () => {
    const result = await formatDate(
      {},
      { inputDate: new Date("2023-03-02"), format: "d/M/yyyy" },
    )
    expect(result).toEqual("2/3/2023")
  })
  test("throws error for invalid input date", async () => {
    try {
      // @ts-expect-error
      await formatDate({}, { inputDate: {}, format: "d/M/yyyy" })
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error)
      if (error instanceof Error) {
        expect(error.message).toEqual("Invalid input date")
      }
    }
  })
  test("formats date from context path", async () => {
    const result = await formatDate(
      { date: "2023-03-02" },
      { inputDate: "date", format: "d/M/yyyy" },
    )
    expect(result).toEqual("2/3/2023")
  })
})
