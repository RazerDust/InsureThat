import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '../api/queryClient'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
