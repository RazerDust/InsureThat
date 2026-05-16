import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Stepper,
  Table,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBriefcase,
  IconFileText,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconTimeline,
  IconUserCheck,
} from '@tabler/icons-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import { crmAccounts, formatCurrency } from '../data'

const statusColors = {
  Active: 'green',
  Review: 'yellow',
  'At risk': 'red',
} as const

export function CrmAccountPage() {
  const { accountId } = useParams()
  const account = crmAccounts.find((candidate) => candidate.id === accountId)

  if (!account) {
    return <Navigate to="/crm" replace />
  }

  const activeRenewalStep = account.status === 'Active' ? 1 : 2

  return (
    <section className="page-stack">
      <PageHeader
        title={account.name}
        description={`${account.entityType} account · ${account.segment} · owner ${account.owner}`}
        actions={
          <Group gap="sm">
            <Button
              component={Link}
              leftSection={<IconArrowLeft size={18} />}
              to="/crm"
              variant="light"
            >
              CRM
            </Button>
            <Button leftSection={<IconMail size={18} />}>Client email</Button>
          </Group>
        }
      />

      <div className="crm-account-hero">
        <Card className="crm-panel" padding="lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Badge color={statusColors[account.status]} variant="light">
                {account.status}
              </Badge>
              <Title order={2} mt="xs">
                Single client view
              </Title>
              <Text c="dimmed">{account.aiSummary}</Text>
            </div>
            <ThemeIcon color="teal" radius="md" size="xl" variant="light">
              <IconSparkles size={24} />
            </ThemeIcon>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} mt="lg">
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Premium
              </Text>
              <Text fw={700}>{formatCurrency(account.premium)}</Text>
            </div>
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Revenue
              </Text>
              <Text fw={700}>{formatCurrency(account.revenue)}</Text>
            </div>
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Renewal
              </Text>
              <Text fw={700}>{account.renewalDate}</Text>
            </div>
          </SimpleGrid>
        </Card>

        <Card className="crm-panel" padding="lg">
          <Group gap="sm" mb="sm">
            <ThemeIcon color="teal" radius="md" variant="light">
              <IconShieldCheck size={18} />
            </ThemeIcon>
            <Title order={3}>Compliance evidence</Title>
          </Group>
          <Text size="sm" c="dimmed">
            Plain English note: this is a visual score from the sample CRM data,
            not a legal decision or final compliance assessment.
          </Text>
          <Progress mt="md" value={account.complianceScore} color="teal" radius="xl" />
          <Stack gap="xs" mt="md">
            {account.missingInfo.map((item) => (
              <Text className="crm-mini-row" key={item} size="sm">
                {item}
              </Text>
            ))}
          </Stack>
        </Card>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card className="crm-panel" padding="lg">
          <Group gap="sm" mb="md">
            <ThemeIcon radius="md" variant="light">
              <IconUserCheck size={18} />
            </ThemeIcon>
            <Title order={3}>Contacts and roles</Title>
          </Group>
          <Stack gap="sm">
            {account.contacts.map((contact) => (
              <div className="crm-contact-card" key={contact.id}>
                <div>
                  <Text fw={700}>{contact.name}</Text>
                  <Text size="sm" c="dimmed">
                    {contact.role}
                  </Text>
                </div>
                <Group gap="xs">
                  <Badge variant="outline">{contact.influence}</Badge>
                  <ThemeIcon radius="xl" variant="subtle">
                    <IconPhone size={16} />
                  </ThemeIcon>
                  <ThemeIcon radius="xl" variant="subtle">
                    <IconMail size={16} />
                  </ThemeIcon>
                </Group>
              </div>
            ))}
          </Stack>
        </Card>

        <Card className="crm-panel" padding="lg">
          <Group gap="sm" mb="md">
            <ThemeIcon radius="md" variant="light">
              <IconTimeline size={18} />
            </ThemeIcon>
            <Title order={3}>Relationship timeline</Title>
          </Group>
          <Timeline active={account.activities.length - 1} bulletSize={28} lineWidth={2}>
            {account.activities.map((activity) => (
              <Timeline.Item key={activity.id} title={activity.title}>
                <Text size="sm" c="dimmed">
                  {activity.date} · {activity.detail}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </SimpleGrid>

      <Card className="crm-panel" padding="lg">
        <Group gap="sm" mb="md">
          <ThemeIcon radius="md" variant="light">
            <IconBriefcase size={18} />
          </ThemeIcon>
          <Title order={3}>Policy file structure</Title>
        </Group>
        <Table.ScrollContainer minWidth={720}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Insurer</Table.Th>
                <Table.Th>Policy number</Table.Th>
                <Table.Th>Premium</Table.Th>
                <Table.Th>Expiry</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {account.policies.map((policy) => (
                <Table.Tr key={policy.id}>
                  <Table.Td>{policy.product}</Table.Td>
                  <Table.Td>{policy.insurer}</Table.Td>
                  <Table.Td>{policy.number}</Table.Td>
                  <Table.Td>{formatCurrency(policy.premium)}</Table.Td>
                  <Table.Td>{policy.expiry}</Table.Td>
                  <Table.Td>
                    <Badge variant="light">{policy.status}</Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card className="crm-panel" padding="lg">
          <Group gap="sm" mb="md">
            <ThemeIcon radius="md" variant="light">
              <IconFileText size={18} />
            </ThemeIcon>
            <Title order={3}>Documents</Title>
          </Group>
          <Stack gap="sm">
            {account.documents.map((document) => (
              <div className="crm-document-card" key={document.id}>
                <Group justify="space-between">
                  <Text fw={700}>{document.name}</Text>
                  <Badge variant="light">{document.status}</Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  {document.type}
                </Text>
                <Divider my="sm" />
                <Text size="sm">{document.summary}</Text>
              </div>
            ))}
          </Stack>
        </Card>

        <Card className="crm-panel" padding="lg">
          <Title order={3} mb="md">
            Renewal workflow
          </Title>
          <Stepper active={activeRenewalStep} orientation="vertical">
            <Stepper.Step label="Client review" description="Confirm needs and changes" />
            <Stepper.Step label="Information collection" description="Request missing evidence" />
            <Stepper.Step label="Market review" description="Prepare submission and compare terms" />
            <Stepper.Step label="Presentation" description="Broker approval before client issue" />
          </Stepper>
        </Card>
      </SimpleGrid>
    </section>
  )
}
