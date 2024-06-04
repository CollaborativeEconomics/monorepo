import { get } from "lodash";

import { ActionContext } from "../types";

export interface FetchDataFromApiParameters {
  endpoint: string;
  method: string;
  body: Record<string, any>;
  headers: Record<string, string>;
}

export default async function fetchDataFromApi(context: ActionContext, parameters: FetchDataFromApiParameters): Promise<any> {
  const endpoint = updateEnpointWithContext(parameters.endpoint as string, context);
  const method = parameters.method as string;
  const body = parameters.body ? JSON.stringify(parameters.body) : null;

  // Use the registry Api key in the request headers
  const headers = {
    'Content-Type': 'application/json',
    ...(parameters.headers as Record<string, string>)
  };

  const response = await fetch(endpoint, { method, body, headers });
  return response.json();
}

function updateEnpointWithContext(endpoint: string, context: Record<string, any>): string {
  // Regex pattern to match template literals in the endpoint string, e.g., {context.input.userId}
  const pattern = /\{([^{}]+)\}/g;

  const replacedEndpoint = endpoint.replace(pattern, (match, key) => {
    const value = get(context, key);
    return value !== undefined ? String(value) : match;
  });

  return replacedEndpoint;
}