import { Badge, Group, Table, Text } from '@mantine/core'
import { EmptyState } from '../../../components/common/EmptyState'
import type { UserRole, UserSummary } from '../types'

type UserTableProps = {
  users: UserSummary[]
}

const roleColors: Record<UserRole, string> = {
  admin: 'red',
  broker: 'indigo',
  member: 'teal',
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users"
        message="User records will appear here after the API returns data."
      />
    )
  }

  return (
    <Table.ScrollContainer minWidth={720}>
      <Table className="data-table" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Last active</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <span className="user-avatar">{user.name.slice(0, 1)}</span>
                  <Text fw={600}>{user.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>
                <Badge color={roleColors[user.role]} variant="light">
                  {user.role}
                </Badge>
              </Table.Td>
              <Table.Td>{user.lastActiveAt}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
