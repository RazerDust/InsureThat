import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api'

export function useSession() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getCurrentUser,
    retry: false,
  })
}
