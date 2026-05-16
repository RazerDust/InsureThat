import {
  Badge,
  Button,
  Card,
  Group,
  List,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import {
  IconBuildingBank,
  IconBuildingSkyscraper,
  IconClipboardList,
  IconShieldCheck,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../../components/common/PageHeader'
import { StatCard } from '../../dashboard/components/StatCard'
import { UserTable } from '../components/UserTable'
import {
  useAdministrationSnapshot,
  useCreateBrokerage,
  useUpdateUserPermission,
  useUpdateUserRole,
} from '../hooks/useUsers'

const actingUserOptions = [
  { label: 'Chris White - system admin', value: 'usr-system-admin' },
  { label: 'Avery Thompson - Harbour admin', value: 'usr-avery' },
  { label: 'Noah Patel - Southern admin', value: 'usr-noah' },
]

export function UsersPage() {
  const [actingUserId, setActingUserId] = useState('usr-system-admin')
  const [brokerageName, setBrokerageName] = useState('')
  const [brokerageRegion, setBrokerageRegion] = useState('Queensland')
  const { data, isLoading, isError } = useAdministrationSnapshot(actingUserId)
  const createBrokerageMutation = useCreateBrokerage(actingUserId)
  const updateRoleMutation = useUpdateUserRole(actingUserId)
  const updatePermissionMutation = useUpdateUserPermission(actingUserId)

  const visibleUserCount = data?.users.length ?? 0
  const visibleBrokerageCount = data?.brokerages.length ?? 0
  const roleCount = data?.roles.length ?? 0

  const metrics = useMemo(
    () => [
      {
        helper: 'Visible to the acting administrator',
        icon: <IconBuildingSkyscraper size={20} />,
        label: 'Brokerages',
        tone: 'green' as const,
        value: visibleBrokerageCount.toString(),
      },
      {
        helper: 'Filtered by tenant and grants',
        icon: <IconUsers size={20} />,
        label: 'Users',
        tone: 'blue' as const,
        value: visibleUserCount.toString(),
      },
      {
        helper: 'Tenant-owned permission sets',
        icon: <IconShieldCheck size={20} />,
        label: 'Roles',
        tone: 'orange' as const,
        value: roleCount.toString(),
      },
    ],
    [roleCount, visibleBrokerageCount, visibleUserCount],
  )

  function handleCreateBrokerage() {
    // A brokerage name is required because it becomes the tenant's display name and slug.
    if (!brokerageName.trim()) {
      return
    }

    createBrokerageMutation.mutate({
      defaultWorkflow: 'New brokerage onboarding',
      name: brokerageName.trim(),
      region: brokerageRegion,
    })
    setBrokerageName('')
  }

  return (
    <section className="page-stack">
      <PageHeader
        title="Tenant and user administration"
        description="Manage brokerages, users, roles and audit trails with clear tenant boundaries."
        actions={
          <Button leftSection={<IconUserPlus size={18} />}>Invite user</Button>
        }
      />

      <Card className="admin-boundary-panel" padding="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Row-level security test
            </Text>
            <Title order={2}>Acting administrator</Title>
            <Text c="dimmed">
              Change this user to see the API return only rows inside their brokerage
              or explicit cross-tenant grants.
            </Text>
          </div>
          <Select
            aria-label="Choose acting administrator"
            data={actingUserOptions}
            onChange={(value) => setActingUserId(value ?? 'usr-system-admin')}
            value={actingUserId}
          />
        </Group>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </SimpleGrid>

      {isError ? (
        <Card className="admin-boundary-panel" padding="lg">
          <Title order={2}>Administration API unavailable</Title>
          <Text c="dimmed">
            Start the backend API to load tenant administration data.
          </Text>
        </Card>
      ) : null}

      <Tabs defaultValue="users">
        <Tabs.List>
          <Tabs.Tab leftSection={<IconUsers size={16} />} value="users">
            Users
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconBuildingBank size={16} />} value="brokerages">
            Brokerages
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconShieldCheck size={16} />} value="roles">
            Roles
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconClipboardList size={16} />} value="audit">
            Audit trail
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users" pt="md">
          <UserTable
            isSavingPermission={updatePermissionMutation.isPending}
            isSavingRole={updateRoleMutation.isPending}
            onPermissionChange={(userId, permission, isGranted) =>
              updatePermissionMutation.mutate({
                payload: { isGranted, permission },
                userId,
              })
            }
            onRoleChange={(userId, roleId) =>
              updateRoleMutation.mutate({ payload: { roleId }, userId })
            }
            roles={data?.roles ?? []}
            users={data?.users ?? []}
          />
          {isLoading ? <Text c="dimmed">Loading users...</Text> : null}
        </Tabs.Panel>

        <Tabs.Panel value="brokerages" pt="md">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
            <Card className="admin-boundary-panel" padding="lg">
              <Title order={2}>Create brokerage</Title>
              <Text c="dimmed" mb="md">
                Only system administrators can create new tenants.
              </Text>
              <Stack gap="sm">
                <TextInput
                  label="Brokerage name"
                  onChange={(event) => setBrokerageName(event.currentTarget.value)}
                  placeholder="Example Risk Partners"
                  value={brokerageName}
                />
                <TextInput
                  label="Region"
                  onChange={(event) => setBrokerageRegion(event.currentTarget.value)}
                  value={brokerageRegion}
                />
                <Button
                  loading={createBrokerageMutation.isPending}
                  onClick={handleCreateBrokerage}
                >
                  Create brokerage
                </Button>
              </Stack>
            </Card>

            <Stack gap="md">
              {(data?.brokerages ?? []).map((brokerage) => (
                <Card className="admin-boundary-panel" key={brokerage.id} padding="lg">
                  <Group justify="space-between">
                    <div>
                      <Title order={3}>{brokerage.name}</Title>
                      <Text c="dimmed">{brokerage.reportingBoundary}</Text>
                    </div>
                    <Badge color="teal" variant="light">
                      {brokerage.status}
                    </Badge>
                  </Group>
                  <Group mt="md" gap="xs">
                    <Badge variant="light">{brokerage.region}</Badge>
                    <Badge variant="light">{brokerage.userCount} users</Badge>
                    <Badge variant="light">{brokerage.templateCount} templates</Badge>
                  </Group>
                </Card>
              ))}
            </Stack>
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="roles" pt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {(data?.roles ?? []).map((role) => (
              <Card className="admin-boundary-panel" key={role.id} padding="lg">
                <Group justify="space-between" mb="xs">
                  <Title order={3}>{role.name}</Title>
                  <Badge variant="light">{role.userCount} users</Badge>
                </Group>
                <Text c="dimmed">{role.description}</Text>
                <Group gap="xs" mt="md">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="light">
                      {permission}
                    </Badge>
                  ))}
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="audit" pt="md">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
            <Card className="admin-boundary-panel" padding="lg">
              <Title order={2}>Security rules</Title>
              <List mt="md" spacing="sm">
                {(data?.securityRules ?? []).map((rule) => (
                  <List.Item key={rule}>{rule}</List.Item>
                ))}
              </List>
            </Card>

            <Stack gap="md">
              {(data?.auditLog ?? []).map((entry) => (
                <Card className="admin-boundary-panel" key={entry.id} padding="lg">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={700}>{entry.action}</Text>
                      <Text size="sm" c="dimmed">
                        {entry.actorName} changed {entry.target}
                      </Text>
                    </div>
                    <Badge variant="light">{entry.brokerageName}</Badge>
                  </Group>
                  <Text mt="sm">{entry.details}</Text>
                  <Text size="xs" c="dimmed" mt="sm">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                </Card>
              ))}
            </Stack>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </section>
  )
}
