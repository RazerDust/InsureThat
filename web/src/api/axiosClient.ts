import axios from 'axios'
import { env } from '../config/env'

// axiosClient is the shared HTTP client for talking to the backend API.
// Keeping this in one file means base URLs and headers only need to be changed once.
export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  // Successful responses pass through unchanged.
  (response) => response,
  // Failed responses are re-thrown so React Query or forms can show useful errors.
  (error) => Promise.reject(error),
)
