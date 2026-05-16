import { Button } from '@mantine/core'
import { IconUserPlus } from '@tabler/icons-react'
import { PageHeader } from '../../../components/common/PageHeader'
import { UserTable } from '../components/UserTable'
import type { UserSummary } from '../types'

const users: UserSummary[] = [
  {
    id: 'usr_001',
    name: 'Avery Thompson',
    email: 'avery@insurethat.example',
    role: 'admin',
    lastActiveAt: 'Today',
  },
  {
    id: 'usr_002',
    name: 'Morgan Lee',
    email: 'morgan@insurethat.example',
    role: 'broker',
    lastActiveAt: 'Yesterday',
  },
  {
    id: 'usr_003',
    name: 'Sam Rivera',
    email: 'sam@insurethat.example',
    role: 'member',
    lastActiveAt: 'May 12',
  },
]

export function UsersPage() {
  return (
    <section className="page-stack">
      <PageHeader
        title="Users"
        description="Manage workspace access and account roles."
        actions={
          <Button leftSection={<IconUserPlus size={18} />}>Add user</Button>
        }
      />
      <UserTable users={users} />
    </section>
  )
}
