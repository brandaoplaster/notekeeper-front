import axios, { type AxiosError, type AxiosResponse } from 'axios'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

client.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => Promise.reject(error),
)

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0

    if (status === 401) {
      return Promise.reject(new ApiError(401, 'Unauthorized'))
    }

    if (status === 500) {
      return Promise.reject(new ApiError(500, 'Internal server error'))
    }

    return Promise.reject(new ApiError(status, error.message))
  },
)

export default client
