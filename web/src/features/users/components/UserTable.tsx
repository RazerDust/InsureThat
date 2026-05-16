import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Select,
  Table,
  Text,
  Tooltip,
} from '@mantine/core'
import { IconShieldPlus, IconShieldX } from '@tabler/icons-react'
import { EmptyState } from '../../../components/common/EmptyState'
import type { AdminUser, Role } from '../types'

type UserTableProps = {
  isSavingPermission: boolean
  isSavingRole: boolean
  onPermissionChange: (userId: string, permission: string, isGranted: boolean) => void
  onRoleChange: (userId: string, roleId: string) => void
  roles: Role[]
  users: AdminUser[]
}

const statusColors: Record<string, string> = {
  Active: 'teal',
  Invited: 'blue',
  Suspended: 'red',
}

export function UserTable({
  isSavingPermission,
  isSavingRole,
  onPermissionChange,
  onRoleChange,
  roles,
  users,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users visible"
        message="The current administrator cannot see users outside their tenant boundary."
      />
    )
  }

  return (
    <Table.ScrollContainer minWidth={980}>
      <Table className="data-table" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Brokerage</Table.Th>
            <Table.Th>Team and office</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Permissions</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => {
            // Roles are tenant-owned, so a user can only be moved into a role from their brokerage.
            const availableRoles = roles
              .filter((role) => role.brokerageId === user.brokerageId)
              .map((role) => ({ label: role.name, value: role.id }))
            const hasReportsPermission = user.permissions.includes('reports.view')
            const hasCrossTenantAccess = user.crossTenantBrokerageIds.length > 0

            return (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <span className="user-avatar">{user.name.slice(0, 1)}</span>
                    <div>
                      <Text fw={700}>{user.name}</Text>
                      <Text size="sm" c="dimmed">
                        {user.email}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text fw={600}>{user.brokerageName}</Text>
                  {hasCrossTenantAccess ? (
                    <Badge color="violet" size="sm" variant="light">
                      Cross-tenant grant
                    </Badge>
                  ) : null}
                </Table.Td>
                <Table.Td>
                  <Text>{user.team}</Text>
                  <Text size="sm" c="dimmed">
                    {user.office}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Select
                    aria-label={`Change role for ${user.name}`}
                    data={availableRoles}
                    disabled={isSavingRole}
                    onChange={(roleId) => {
                      if (roleId && roleId !== user.roleId) {
                        onRoleChange(user.id, roleId)
                      }
                    }}
                    value={user.roleId}
                  />
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {user.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="light">
                        {permission}
                      </Badge>
                    ))}
                    <Tooltip
                      label={
                        hasReportsPermission
                          ? 'Remove reporting permission'
                          : 'Grant reporting permission'
                      }
                    >
                      <ActionIcon
                        aria-label={
                          hasReportsPermission
                            ? `Remove reporting permission from ${user.name}`
                            : `Grant reporting permission to ${user.name}`
                        }
                        color={hasReportsPermission ? 'red' : 'teal'}
                        disabled={isSavingPermission}
                        onClick={() =>
                          onPermissionChange(
                            user.id,
                            'reports.view',
                            !hasReportsPermission,
                          )
                        }
                        variant="light"
                      >
                        {hasReportsPermission ? (
                          <IconShieldX size={18} />
                        ) : (
                          <IconShieldPlus size={18} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <Badge color={statusColors[user.status] ?? 'gray'} variant="light">
                      {user.status}
                    </Badge>
                    <Button size="compact-sm" variant="subtle">
                      Status
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
