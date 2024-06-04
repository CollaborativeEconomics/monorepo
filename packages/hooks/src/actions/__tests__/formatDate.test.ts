import { expect, test, describe, beforeAll, afterEach, afterAll } from "bun:test";
import formatDate from "../formatDate";
import { setDateToReturnMockDate } from "../../../mocks/date";

describe("formatDate action", async () => {
  test("formats date timestamp", async () => {
    setDateToReturnMockDate('2023-03-02');
    const result = await formatDate({}, { inputDate: Date.now(), format: 'yyyy-MM-dd' });
    expect(result).toEqual(new Date().toISOString().split('T')[0]);
  })
  test("formats date string", async () => {
    const result = await formatDate({}, { inputDate: '2023-03-02', format: 'd/M/yyyy' });
    expect(result).toEqual('2/3/2023');
  })
  test("formats date object", async () => {
    const result = await formatDate({}, { inputDate: new Date('2023-03-02'), format: 'd/M/yyyy' });
    expect(result).toEqual('2/3/2023');
  })
  test("throws error for invalid input date", async () => {
    try {
      // @ts-expect-error
      await formatDate({}, { inputDate: {}, format: 'd/M/yyyy' });
    } catch (error) {
      expect(error.message).toEqual('Invalid input date');
    }
  })
  test("formats date from context path", async () => {
    const result = await formatDate({ date: '2023-03-02' }, { inputDate: 'date', format: 'd/M/yyyy' });
    expect(result).toEqual('2/3/2023');
  })
})