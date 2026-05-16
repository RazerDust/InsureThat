import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconBell,
  IconBuildingSkyscraper,
  IconDashboard,
  IconLogin2,
  IconMoon,
  IconShieldCheck,
  IconSun,
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
  { to: '/crm', label: 'CRM', icon: <IconBuildingSkyscraper size={18} /> },
  { to: '/users', label: 'Users', icon: <IconUsers size={18} /> },
  { to: '/login', label: 'Sign in', icon: <IconLogin2 size={18} /> },
]

export function AppShellLayout() {
  const { toggleColorScheme } = useMantineColorScheme()
  const colorScheme = useComputedColorScheme('light')
  const isDarkMode = colorScheme === 'dark'

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

      <div className="app-workspace">
        <header className="app-topbar">
          <div>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Workspace
            </Text>
            <Text fw={700}>Insurance operations</Text>
          </div>

          <Group gap="sm" wrap="nowrap">
            <Badge variant="light" color="teal">
              Live
            </Badge>

            <Tooltip label="Notifications">
              <ActionIcon
                aria-label="View notifications"
                radius="md"
                size="lg"
                variant="subtle"
              >
                <IconBell size={20} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={isDarkMode ? 'Use light mode' : 'Use dark mode'}>
              <ActionIcon
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => toggleColorScheme()}
                radius="md"
                size="lg"
                variant="light"
              >
                {/* Show the action the button will perform next. */}
                {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>

            <Group className="app-account" gap="sm" wrap="nowrap">
              <Avatar color="teal" radius="xl" size="sm">
                CW
              </Avatar>
              <div>
                <Text size="sm" fw={700}>
                  Chris White
                </Text>
                <Text size="xs" c="dimmed">
                  Admin
                </Text>
              </div>
            </Group>
          </Group>
        </header>

        <main className="app-main">
          <div className="app-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
