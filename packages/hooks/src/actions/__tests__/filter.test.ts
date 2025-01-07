import { expect, test, describe, beforeAll, afterEach, afterAll } from "bun:test";
import filter from "../filter";

const inputContext = {
  b: [
    { c: 1, d: false },
    { c: 2, d: true },
    { c: 3, d: true },
  ],
  a: {
    b: {
      c: 1,
      d: 2
    }
  },
  c: [
    1, 2, 3
  ],
  d: [
    { date: Date.now() },
    { date: Date.now() + 100 },
    { date: Date.now() - 100 }
  ]
}

describe("filter action", async () => {
  test("filters using ===", async () => {
    const result = await filter(inputContext, { collectionPath: 'b', operator: '===', value: 1, key: 'c' });
    expect(result).toEqual([inputContext.b[0]]);
  })
  test("filters using !==", async () => {
    const result = await filter(inputContext, { collectionPath: 'b', operator: '!==', value: 1, key: 'c' });
    expect(result).toEqual([inputContext.b[1], inputContext.b[2]]);
  })
  test("filters using >", async () => {
    const result = await filter(inputContext, { collectionPath: 'b', operator: '>', value: 1, key: 'c' });
    expect(result).toEqual([inputContext.b[1], inputContext.b[2]]);
  })
})