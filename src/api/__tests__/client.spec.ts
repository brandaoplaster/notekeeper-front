import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

vi.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  }

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  }
})

import client, { ApiError } from '@/api/client'
import axios from 'axios'

describe('ApiError', () => {
  it('should create error with status and message', () => {
    const error = new ApiError(404, 'Not found')

    expect(error).toBeInstanceOf(Error)
    expect(error.status).toBe(404)
    expect(error.message).toBe('Not found')
    expect(error.name).toBe('ApiError')
  })

  it('should extend Error class', () => {
    const error = new ApiError(500, 'Server error')

    expect(error instanceof Error).toBe(true)
    expect(error.stack).toBeDefined()
  })

  it('should have public status property', () => {
    const error = new ApiError(403, 'Forbidden')

    expect(error).toHaveProperty('status')
    expect(error.status).toBe(403)
  })

  it('should be throwable', () => {
    expect(() => {
      throw new ApiError(400, 'Bad Request')
    }).toThrow('Bad Request')
  })

  it('should be catchable as ApiError instance', () => {
    try {
      throw new ApiError(422, 'Validation error')
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError)
      expect((error as ApiError).status).toBe(422)
    }
  })
})

describe('axios client configuration', () => {
  it('should create client with correct baseURL', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: import.meta.env.VITE_API_URL,
      }),
    )
  })

  it('should create client with correct headers', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
  })

  it('should create client with 10 second timeout', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 10000,
      }),
    )
  })

  it('should create client with all configuration options', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
  })

  it('should register request interceptor', () => {
    const mockInstance = vi.mocked(axios.create).mock.results[0]?.value as any
    expect(mockInstance.interceptors.request.use).toHaveBeenCalled()
  })

  it('should register response interceptor', () => {
    const mockInstance = vi.mocked(axios.create).mock.results[0]?.value as any
    expect(mockInstance.interceptors.response.use).toHaveBeenCalled()
  })
})

describe('request interceptor', () => {
  let onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  let onRejected: (error: AxiosError) => Promise<never>

  beforeEach(() => {
    const mockInstance = vi.mocked(axios.create).mock.results[0]?.value as any
    const requestInterceptorCall = mockInstance?.interceptors.request.use.mock.calls[0]
    onFulfilled = requestInterceptorCall?.[0]
    onRejected = requestInterceptorCall?.[1]
  })

  it('should pass through config unchanged on success', () => {
    const mockConfig = {
      url: '/test',
      method: 'GET',
      headers: {},
    } as InternalAxiosRequestConfig

    const result = onFulfilled(mockConfig)

    expect(result).toBe(mockConfig)
    expect(result).toEqual(mockConfig)
  })

  it('should not modify request config', () => {
    const mockConfig = {
      url: '/notes',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { title: 'Test' },
    } as InternalAxiosRequestConfig

    const result = onFulfilled(mockConfig)

    expect(result.url).toBe('/notes')
    expect(result.method).toBe('POST')
    expect(result.data).toEqual({ title: 'Test' })
  })

  it('should reject errors on request failure', async () => {
    const mockError = new Error('Request setup failed') as AxiosError

    await expect(onRejected(mockError)).rejects.toThrow('Request setup failed')
  })

  it('should preserve error type on rejection', async () => {
    const mockError = new Error('Network error') as AxiosError

    try {
      await onRejected(mockError)
    } catch (error) {
      expect(error).toBe(mockError)
    }
  })
})

describe('response interceptor - success', () => {
  let onFulfilled: (response: AxiosResponse) => AxiosResponse

  beforeEach(() => {
    const mockInstance = vi.mocked(axios.create).mock.results[0]?.value as any
    const responseInterceptorCall = mockInstance?.interceptors.response.use.mock.calls[0]
    onFulfilled = responseInterceptorCall?.[0]
  })

  it('should pass through successful responses unchanged', () => {
    const mockResponse = {
      data: { id: 1, title: 'Test' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse

    const result = onFulfilled(mockResponse)

    expect(result).toBe(mockResponse)
    expect(result).toEqual(mockResponse)
  })

  it('should not modify response data', () => {
    const mockResponse = {
      data: [{ id: 1 }, { id: 2 }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse

    const result = onFulfilled(mockResponse)

    expect(result.data).toEqual([{ id: 1 }, { id: 2 }])
    expect(result.status).toBe(200)
  })

  it('should handle 201 Created responses', () => {
    const mockResponse = {
      data: { id: 'new-id' },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse

    const result = onFulfilled(mockResponse)

    expect(result.status).toBe(201)
    expect(result.data).toEqual({ id: 'new-id' })
  })

  it('should handle 204 No Content responses', () => {
    const mockResponse = {
      data: null,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse

    const result = onFulfilled(mockResponse)

    expect(result.status).toBe(204)
    expect(result.data).toBeNull()
  })
})

describe('response interceptor - error handling', () => {
  let onRejected: (error: AxiosError) => Promise<never>

  beforeEach(() => {
    const mockInstance = vi.mocked(axios.create).mock.results[0]?.value as any
    const responseInterceptorCall = mockInstance?.interceptors.response.use.mock.calls[0]
    onRejected = responseInterceptorCall?.[1]
  })

  describe('401 Unauthorized', () => {
    it('should transform 401 to ApiError with Unauthorized message', async () => {
      const axiosError = {
        message: 'Auth failed',
        response: { status: 401 },
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 401,
        message: 'Unauthorized',
        name: 'ApiError',
      })
    })

    it('should override original message for 401', async () => {
      const axiosError = {
        message: 'Original message',
        response: { status: 401 },
      } as AxiosError

      try {
        await onRejected(axiosError)
      } catch (error) {
        expect((error as ApiError).message).toBe('Unauthorized')
        expect((error as ApiError).message).not.toBe('Original message')
      }
    })
  })

  describe('500 Internal Server Error', () => {
    it('should transform 500 to ApiError with server error message', async () => {
      const axiosError = {
        message: 'Server crashed',
        response: { status: 500 },
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 500,
        message: 'Internal server error',
        name: 'ApiError',
      })
    })

    it('should override original message for 500', async () => {
      const axiosError = {
        message: 'Something went wrong',
        response: { status: 500 },
      } as AxiosError

      try {
        await onRejected(axiosError)
      } catch (error) {
        expect((error as ApiError).message).toBe('Internal server error')
      }
    })
  })

  describe('other HTTP errors', () => {
    const testCases = [
      { status: 400, message: 'Bad Request' },
      { status: 403, message: 'Forbidden' },
      { status: 404, message: 'Not Found' },
      { status: 422, message: 'Unprocessable Entity' },
      { status: 429, message: 'Too Many Requests' },
      { status: 502, message: 'Bad Gateway' },
      { status: 503, message: 'Service Unavailable' },
    ]

    testCases.forEach(({ status, message }) => {
      it(`should preserve original message for ${status}`, async () => {
        const axiosError = {
          message,
          response: { status },
        } as AxiosError

        await expect(onRejected(axiosError)).rejects.toMatchObject({
          status,
          message,
          name: 'ApiError',
        })
      })
    })

    it('should transform 404 with custom message', async () => {
      const axiosError = {
        message: 'Resource not found',
        response: { status: 404 },
      } as AxiosError

      try {
        await onRejected(axiosError)
      } catch (error) {
        expect((error as ApiError).status).toBe(404)
        expect((error as ApiError).message).toBe('Resource not found')
      }
    })

    it('should transform 422 validation errors', async () => {
      const axiosError = {
        message: 'Validation failed',
        response: { status: 422 },
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 422,
        message: 'Validation failed',
      })
    })
  })

  describe('network errors', () => {
    it('should handle errors without response (network error)', async () => {
      const axiosError = {
        message: 'Network Error',
        response: undefined,
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 0,
        message: 'Network Error',
        name: 'ApiError',
      })
    })

    it('should handle timeout errors', async () => {
      const axiosError = {
        message: 'timeout of 10000ms exceeded',
        response: undefined,
      } as AxiosError

      try {
        await onRejected(axiosError)
      } catch (error) {
        expect((error as ApiError).status).toBe(0)
        expect((error as ApiError).message).toContain('timeout')
      }
    })

    it('should handle connection refused', async () => {
      const axiosError = {
        message: 'connect ECONNREFUSED',
        response: undefined,
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 0,
        message: 'connect ECONNREFUSED',
      })
    })
  })

  describe('edge cases', () => {
    it('should handle error with null response', async () => {
      const axiosError = {
        message: 'Unknown error',
        response: null,
      } as any

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 0,
        message: 'Unknown error',
      })
    })

    it('should handle error with response but no status', async () => {
      const axiosError = {
        message: 'Weird error',
        response: {} as any,
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 0,
        message: 'Weird error',
      })
    })

    it('should always return ApiError instance', async () => {
      const axiosError = {
        message: 'Any error',
        response: { status: 418 },
      } as AxiosError

      try {
        await onRejected(axiosError)
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
      }
    })

    it('should handle status code 0', async () => {
      const axiosError = {
        message: 'CORS error',
        response: { status: 0 } as any,
      } as AxiosError

      await expect(onRejected(axiosError)).rejects.toMatchObject({
        status: 0,
        message: 'CORS error',
      })
    })
  })
})

describe('client export', () => {
  it('should export client instance', () => {
    expect(client).toBeDefined()
  })

  it('should export ApiError class', () => {
    expect(ApiError).toBeDefined()
    expect(typeof ApiError).toBe('function')
  })
})
