import { QueryClient } from '@tanstack/react-query'

// React Query stores server data in a client-side cache.
// These defaults keep screens stable while still retrying once for brief network hiccups.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
})
