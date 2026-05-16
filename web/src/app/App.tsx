import { AppProviders } from './providers'
import { AppRouter } from './router'

// App is intentionally small: providers set up shared app services, then the router chooses the page.
export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
