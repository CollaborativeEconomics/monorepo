import { expect, test, describe, beforeAll, afterEach, afterAll } from "bun:test";
import transform, { transformEach } from "../transform";
import { retirementData } from "../../../mocks/serverMock";

describe("transform action", async () => {
  test("transforms an object", async () => {
    const result = await transform({
      input: {
        a: 1,
        b: 2,
        c: 3
      }
    },
      {
        'input.a': 'output.a',
        'input.b': 'output.b',
        'input.c': 'output.c',
      })
    expect(result).toEqual({ output: { a: 1, b: 2, c: 3 } });
  })
})

describe("transformEach action", async () => {
  test("transforms an array of objects", async () => {
    const context = {
      input: [
        { a: 1, b: 2, c: 3 },
        { a: 4, b: 5, c: 6 },
        { a: 7, b: 8, c: 9 }
      ]
    };
    const transformParameter = {
      'a': 'output.a',
      'b': 'output.b',
      'c': 'output.c',
    };
    const result = await transformEach(
      context,
      {
        collectionPath: 'input',
        transformParameter
      })
    expect(result).toEqual([
      { output: { a: 1, b: 2, c: 3 } },
      { output: { a: 4, b: 5, c: 6 } },
      { output: { a: 7, b: 8, c: 9 } }
    ]);
  })
  test("transforms an array of nested objects", async () => {
    const context = {
      retirements: retirementData
    }
    const transformParams = {
      collectionPath: "retirements.retirements",
      transformParameter: {
        "retirement_beneficiary": 'metadata.walletAddress',
        "certificate_id": 'metadata.certificateId',
        "retirement_date": 'metadata.retirementDate',
        "serial_numbers": 'metadata.serialNumbers',
        "vcs_id": 'metadata.vcsId',
      }
    }
    const result = await transformEach(context, transformParams)
    expect(result).toMatchObject([{
      metadata: {
        walletAddress: retirementData.retirements[0].retirement_beneficiary,
        certificateId: retirementData.retirements[0].certificate_id,
        retirementDate: retirementData.retirements[0].retirement_date,
        serialNumbers: retirementData.retirements[0].serial_numbers,
        vcsId: retirementData.retirements[0].vcs_id,
      }
    }])
  })
})