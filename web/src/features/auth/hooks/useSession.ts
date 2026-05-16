import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api'

// useSession is a small hook for loading the currently signed-in user.
export function useSession() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getCurrentUser,
    // Session checks should fail quietly instead of retrying forever when logged out.
    retry: false,
  })
}
