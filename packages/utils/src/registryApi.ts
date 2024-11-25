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
    this.baseUrl = typeof window !== "undefined" ? `${window.location.origin}/api` : "/api"
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
    //console.log('REG-API URL', url)
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred")
      }

      return {
        data,
        success: true,
      }
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
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T, U = unknown>(
    endpoint: string,
    data: U,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T, U = unknown>(
    endpoint: string,
    data: U,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Export a singleton instance
export const registryApi = new RegistryApi()
