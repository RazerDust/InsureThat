import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Progress,
  RingProgress,
  Select,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBriefcase,
  IconBuildingSkyscraper,
  IconCalendarDue,
  IconChecklist,
  IconCircleCheck,
  IconClock,
  IconFileText,
  IconMail,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconUsersGroup,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import { crmAccounts, crmStatusColors, formatCurrency } from '../data'

export function CrmPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [workMode, setWorkMode] = useState('relationship')
  const [selectedAccountId, setSelectedAccountId] = useState(crmAccounts[0].id)

  const filteredAccounts = useMemo(() => {
    const lowerSearch = search.toLowerCase()

    // Keep all filtering in one place so the table, insight panel and selected record agree.
    return crmAccounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(lowerSearch) ||
        account.segment.toLowerCase().includes(lowerSearch) ||
        account.owner.toLowerCase().includes(lowerSearch)
      const matchesStatus = statusFilter === 'All' || account.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const selectedAccount =
    filteredAccounts.find((account) => account.id === selectedAccountId) ??
    filteredAccounts[0] ??
    crmAccounts[0]

  const openTasks = crmAccounts.flatMap((account) =>
    account.tasks.filter((task) => task.status !== 'Done'),
  )
  const totalPremium = crmAccounts.reduce((sum, account) => sum + account.premium, 0)
  const averageCompliance = Math.round(
    crmAccounts.reduce((sum, account) => sum + account.complianceScore, 0) /
      crmAccounts.length,
  )

  return (
    <section className="page-stack">
      <PageHeader
        title="CRM"
        description="A broker workspace for accounts, contacts, relationships, activities and AI-assisted client action."
        actions={
          <Group gap="sm">
            <Button leftSection={<IconMail size={18} />} variant="light">
              Draft email
            </Button>
            <Button leftSection={<IconPlus size={18} />}>New account</Button>
          </Group>
        }
      />

      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
        <CrmMetric
          icon={<IconBuildingSkyscraper size={20} />}
          label="Managed accounts"
          value={crmAccounts.length.toString()}
          helper="Across CRM portfolio"
        />
        <CrmMetric
          icon={<IconBriefcase size={20} />}
          label="Premium managed"
          value={formatCurrency(totalPremium)}
          helper="Current active records"
        />
        <CrmMetric
          icon={<IconChecklist size={20} />}
          label="Open CRM tasks"
          value={openTasks.length.toString()}
          helper="Relationship and compliance work"
        />
        <CrmMetric
          icon={<IconShieldCheck size={20} />}
          label="Compliance health"
          value={`${averageCompliance}%`}
          helper="Average account evidence score"
        />
      </SimpleGrid>

      <div className="crm-command-bar">
        <TextInput
          aria-label="Search CRM accounts"
          leftSection={<IconSearch size={18} />}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search accounts, owner or industry"
          value={search}
        />
        <Select
          aria-label="Filter by account status"
          data={['All', 'Active', 'Review', 'At risk']}
          onChange={(value) => setStatusFilter(value ?? 'All')}
          value={statusFilter}
        />
        <SegmentedControl
          aria-label="Choose CRM working mode"
          data={[
            { label: 'Relationships', value: 'relationship' },
            { label: 'Tasks', value: 'tasks' },
            { label: 'Compliance', value: 'compliance' },
          ]}
          onChange={setWorkMode}
          value={workMode}
        />
      </div>

      <div className="crm-workspace-grid">
        <Card className="crm-panel" padding="lg">
          <Group justify="space-between" mb="md">
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Account list
              </Text>
              <Title order={2}>Broker CRM portfolio</Title>
            </div>
            <Badge variant="light">{filteredAccounts.length} shown</Badge>
          </Group>

          <Table.ScrollContainer minWidth={560}>
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Owner</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Premium</Table.Th>
                  <Table.Th>Renewal</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredAccounts.map((account) => (
                  <Table.Tr
                    className={
                      account.id === selectedAccount.id ? 'crm-table-row is-selected' : 'crm-table-row'
                    }
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                  >
                    <Table.Td>
                      <Text fw={700}>{account.name}</Text>
                      <Text size="sm" c="dimmed">
                        {account.entityType} · {account.segment}
                      </Text>
                    </Table.Td>
                    <Table.Td>{account.owner}</Table.Td>
                    <Table.Td>
                      <Badge color={crmStatusColors[account.status]} variant="light">
                        {account.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{formatCurrency(account.premium)}</Table.Td>
                    <Table.Td>{account.renewalDate}</Table.Td>
                    <Table.Td>
                      <Tooltip label="Open account workspace">
                        <ActionIcon
                          aria-label={`Open ${account.name}`}
                          component={Link}
                          to={`/crm/accounts/${account.id}`}
                          variant="subtle"
                        >
                          <IconArrowRight size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>

        <Card className="crm-panel" padding="lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Live client view
              </Text>
              <Title order={2}>{selectedAccount.name}</Title>
              <Text c="dimmed">{selectedAccount.risk}</Text>
            </div>
            <RingProgress
              size={92}
              thickness={10}
              sections={[{ value: selectedAccount.complianceScore, color: 'teal' }]}
              label={
                <Text ta="center" fw={700} size="sm">
                  {selectedAccount.complianceScore}%
                </Text>
              }
            />
          </Group>

          <Card className="crm-ai-card" mt="md" padding="md">
            <Group gap="sm" align="flex-start">
              <ThemeIcon color="teal" radius="md" variant="light">
                <IconSparkles size={18} />
              </ThemeIcon>
              <div>
                <Text fw={700}>AI account summary</Text>
                <Text size="sm">{selectedAccount.aiSummary}</Text>
              </div>
            </Group>
          </Card>

          <Tabs className="crm-tabs" defaultValue={workMode} value={workMode} onChange={(value) => setWorkMode(value ?? 'relationship')}>
            <Tabs.List>
              <Tabs.Tab leftSection={<IconUsersGroup size={16} />} value="relationship">
                Relationships
              </Tabs.Tab>
              <Tabs.Tab leftSection={<IconChecklist size={16} />} value="tasks">
                Tasks
              </Tabs.Tab>
              <Tabs.Tab leftSection={<IconShieldCheck size={16} />} value="compliance">
                Compliance
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="relationship" pt="md">
              <Stack gap="sm">
                {selectedAccount.contacts.map((contact) => (
                  <div className="crm-contact-line" key={contact.id}>
                    <div>
                      <Text fw={700}>{contact.name}</Text>
                      <Text size="sm" c="dimmed">
                        {contact.role} · {contact.email}
                      </Text>
                    </div>
                    <Badge variant="outline">{contact.influence}</Badge>
                  </div>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="tasks" pt="md">
              <Stack gap="sm">
                {selectedAccount.tasks.map((task) => (
                  <div className="crm-task-line" key={task.id}>
                    <ThemeIcon
                      color={task.priority === 'High' ? 'red' : 'blue'}
                      radius="xl"
                      variant="light"
                    >
                      {task.status === 'Blocked' ? <IconClock size={18} /> : <IconCircleCheck size={18} />}
                    </ThemeIcon>
                    <div>
                      <Text fw={700}>{task.title}</Text>
                      <Text size="sm" c="dimmed">
                        {task.relatedTo} · due {task.due}
                      </Text>
                    </div>
                  </div>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="compliance" pt="md">
              <Stack gap="sm">
                {selectedAccount.missingInfo.map((item) => (
                  <div className="crm-gap-line" key={item}>
                    <IconCalendarDue size={18} />
                    <Text>{item}</Text>
                  </div>
                ))}
                <Progress value={selectedAccount.complianceScore} color="teal" radius="xl" />
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </div>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        <CrmQueue title="Documents" icon={<IconFileText size={18} />} items={selectedAccount.documents.map((document) => `${document.name} · ${document.status}`)} />
        <CrmQueue title="Policies" icon={<IconBriefcase size={18} />} items={selectedAccount.policies.map((policy) => `${policy.product} · ${policy.status}`)} />
        <CrmQueue title="Recent activity" icon={<IconClock size={18} />} items={selectedAccount.activities.map((activity) => `${activity.date}: ${activity.title}`)} />
      </SimpleGrid>
    </section>
  )
}

type CrmMetricProps = {
  helper: string
  icon: ReactNode
  label: string
  value: string
}

function CrmMetric({ helper, icon, label, value }: CrmMetricProps) {
  return (
    <Card className="crm-metric" padding="lg">
      <Group justify="space-between">
        <Text size="sm" fw={700} c="dimmed">
          {label}
        </Text>
        <ThemeIcon radius="md" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
      <Text className="crm-metric-value">{value}</Text>
      <Text size="sm" c="dimmed">
        {helper}
      </Text>
    </Card>
  )
}

type CrmQueueProps = {
  icon: ReactNode
  items: string[]
  title: string
}

function CrmQueue({ icon, items, title }: CrmQueueProps) {
  return (
    <Card className="crm-panel" padding="lg">
      <Group gap="sm" mb="md">
        <ThemeIcon radius="md" variant="light">
          {icon}
        </ThemeIcon>
        <Title order={3}>{title}</Title>
      </Group>
      <Stack gap="xs">
        {items.map((item) => (
          <Text className="crm-mini-row" key={item} size="sm">
            {item}
          </Text>
        ))}
      </Stack>
    </Card>
  )
}
