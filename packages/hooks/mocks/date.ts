// default mock date, if you want one
export const setDateToReturnMockDate = (date) => {
  const mockDate = new Date(date)
  const _Date = Date
  class MockDate extends _Date {
    // can accept an array, e.g. new Date(2023, 3, 2);
    constructor(...date) {
      // @ts-expect-error typescript doesn't like separate arg inputs
      super(date)
      // @ts-expect-error typescript doesn't like separate arg inputs
      return date.length ? new _Date(...date) : mockDate
    }
  }
  MockDate.now = () => +mockDate
  // @ts-expect-error Dates don't only return strings
  global.Date = MockDate
}
