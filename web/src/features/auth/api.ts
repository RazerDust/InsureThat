import { axiosClient } from '../../api/axiosClient'
import type { AuthUser, LoginRequest, LoginResponse } from './types'

// These functions keep authentication HTTP calls out of the UI components.
export async function getCurrentUser() {
  const { data } = await axiosClient.get<AuthUser>('/auth/me')
  return data
}

export async function login(payload: LoginRequest) {
  // The payload contains the email and password from the login form.
  const { data } = await axiosClient.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function logout() {
  // The backend can clear its session cookie or token state here when auth is connected.
  await axiosClient.post('/auth/logout')
}
