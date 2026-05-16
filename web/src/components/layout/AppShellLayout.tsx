import { Group, Text } from '@mantine/core'
import {
  IconDashboard,
  IconLogin2,
  IconShieldCheck,
  IconUsers,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type NavigationItem = {
  icon: ReactNode
  label: string
  to: string
}

const navigationItems: NavigationItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <IconDashboard size={18} /> },
  { to: '/users', label: 'Users', icon: <IconUsers size={18} /> },
  { to: '/login', label: 'Sign in', icon: <IconLogin2 size={18} /> },
]

export function AppShellLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Group gap="sm" className="app-brand">
          <IconShieldCheck size={28} stroke={1.8} />
          <div>
            <Text fw={700}>InsureThat</Text>
            <Text size="xs" c="dimmed">
              Operations
            </Text>
          </div>
        </Group>

        <nav className="app-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'app-nav-link is-active' : 'app-nav-link'
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
