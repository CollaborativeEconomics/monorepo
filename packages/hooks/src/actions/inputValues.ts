export interface InputValuesParameters {
  [key: string]:
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | InputValuesParameters
}

export default async function inputValues(
  context: unknown,
  parameters: InputValuesParameters,
): Promise<unknown> {
  return parameters
}
