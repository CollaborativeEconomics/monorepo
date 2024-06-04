export interface InputValuesParameters {
  [key: string]:
  string
  | number
  | boolean
  | Array<string | number | boolean>
  | InputValuesParameters;
}

export default async function inputValues(context: any, parameters: InputValuesParameters): Promise<any> {
  return parameters;
}