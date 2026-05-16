import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/global.css'

// This is the browser entry point for the whole React app.
// Vite loads web/index.html, finds the <div id="root"> element, and React mounts our app into it.
createRoot(document.getElementById('root')!).render(
  // StrictMode helps catch common React mistakes while we are developing locally.
  <StrictMode>
    <App />
  </StrictMode>,
)
