import appConfig from "@cfce/app-config"

interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export class RegistryApi {
  private baseUrl: string

  constructor() {
    // Use window.location.origin in the browser, fallback to "/" for SSR
    // this.baseUrl = typeof window !== "undefined" ? `${window.location.origin}/api` : `${process.env.AUTH_URL}/api`
    if (typeof window !== "undefined") {
      this.baseUrl = `${window.location.origin}/api`
    } else if (process.env.AUTH_URL) {
      this.baseUrl = `${process.env.AUTH_URL}/api`
    } else if (appConfig.apis.registry.apiUrl) {
      this.baseUrl = appConfig.apis.registry.apiUrl
    } else {
      throw new Error("Registry API URL is not set")
    }
    //this.baseUrl = appConfig.apis.registry.apiUrl
    //console.log('BASE URL', this.baseUrl)
    if (!this.baseUrl) {
      throw new Error("Registry API URL is not set")
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      const result = await response.json()
      //console.log('RESULT', result)
      return result // it already contains success and data fields
      //return {
      //  data,
      //  success: true,
      //}

      //const data: ApiResponse<T> = await response.json()
      //if (!data.success) {
      //  throw new Error(data.error || "An error occurred")
      //}
      // console.log("REG-API RESPONSE", data)
      //return data
    } catch (error) {
      return {
        data: null as T,
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await this.request<T>(endpoint, { method: "GET" })
    //console.log('RES', res)
    return res
  }

  async post<T, U = unknown>(
    endpoint: string,
    data: U,
  ): Promise<ApiResponse<T>> {
    const res = await this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
    //console.log('RES', res)
    return res
  }

  async put<T, U = unknown>(
    endpoint: string,
    data: U,
  ): Promise<ApiResponse<T>> {
    const res = await this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    //console.log('RES', res)
    return res
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await this.request<T>(endpoint, { method: "DELETE" })
    console.log("RES", res)
    return res
  }
}

// Export a singleton instance
export const registryApi = new RegistryApi()
