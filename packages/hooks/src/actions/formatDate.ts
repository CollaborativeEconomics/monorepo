import { get } from "lodash"
import { DateTime } from "luxon"

export interface FormatDateParameters {
  inputDate: string | number | Date
  format: string
}

export default async function inputValues(
  context: unknown,
  { inputDate, format }: FormatDateParameters,
): Promise<string> {
  switch (typeof inputDate) {
    case "number": {
      return DateTime.fromMillis(inputDate).setZone("UTC").toFormat(format)
    }
    case "string": {
      // if it's a context path, get the value
      const dateFromPath = get(context, inputDate, false)
      if (dateFromPath) {
        return inputValues(context, { inputDate: dateFromPath, format })
      }
      return DateTime.fromISO(inputDate).setZone("UTC").toFormat(format)
    }
    case "object": {
      return DateTime.fromJSDate(inputDate).setZone("UTC").toFormat(format)
    }
    default: {
      throw new Error("Invalid input date")
    }
  }
}
