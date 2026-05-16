import { axiosClient } from '../../api/axiosClient'
import type { UserSummary } from './types'

export async function listUsers() {
  const { data } = await axiosClient.get<UserSummary[]>('/users')
  return data
}

export async function getUser(userId: string) {
  const { data } = await axiosClient.get<UserSummary>(`/users/${userId}`)
  return data
}
