import { describe, expect, test } from "@jest/globals"
import inputValues from "../inputValues"

describe("inputValues action", async () => {
  test("returns the input values", async () => {
    const values = { a: 1, b: "string", c: true }
    const result = await inputValues({}, values)
    expect(result).toEqual(values)
  })
})
