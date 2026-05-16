import { useQuery } from '@tanstack/react-query'
import { getUser, listUsers } from '../api'

const usersQueryKey = ['users'] as const

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: listUsers,
  })
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: [...usersQueryKey, userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  })
}
