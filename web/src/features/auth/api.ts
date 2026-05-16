import { axiosClient } from '../../api/axiosClient'
import type { AuthUser, LoginRequest, LoginResponse } from './types'

export async function getCurrentUser() {
  const { data } = await axiosClient.get<AuthUser>('/auth/me')
  return data
}

export async function login(payload: LoginRequest) {
  const { data } = await axiosClient.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function logout() {
  await axiosClient.post('/auth/logout')
}
