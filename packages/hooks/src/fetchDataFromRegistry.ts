import { getRegistryApiKey, getRegistryBaseUrl } from "./init";

// fetchDataFromRegistry.ts
const fetchDataFromRegistry = async (endpoint: string, params: Record<string, any> = {}): Promise<any> => {
  const ApiKey = getRegistryApiKey();
  const url = new URL(`${getRegistryBaseUrl()}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    method: 'GET', // or 'POST', etc., as needed
    headers: {
      'Authorization': `Bearer ${ApiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  return response.json();
};

export default fetchDataFromRegistry;
