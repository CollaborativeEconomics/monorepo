import {
  expect,
  test,
  describe,
  beforeAll,
  afterEach,
  afterAll,
} from "bun:test"
import inputValues from "../inputValues"

describe("inputValues action", async () => {
  test("returns the input values", async () => {
    const values = { a: 1, b: "string", c: true }
    const result = await inputValues({}, values)
    expect(result).toEqual(values)
  })
})
