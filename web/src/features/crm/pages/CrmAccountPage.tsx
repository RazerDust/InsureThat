import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  NumberInput,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Table,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBriefcase,
  IconDeviceFloppy,
  IconPencil,
  IconTrash,
  IconFileText,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconTimeline,
  IconUserCheck,
} from '@tabler/icons-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import { crmStatusColors, formatCurrency } from '../data'
import { useCrmAccount, useDeleteCrmAccount, useUpdateCrmAccount } from '../hooks'
import type { SaveCrmAccountPayload } from '../api'

type EditAccountForm = Pick<
  SaveCrmAccountPayload,
  | 'aiSummary'
  | 'complianceScore'
  | 'entityType'
  | 'name'
  | 'owner'
  | 'premium'
  | 'renewalDate'
  | 'revenue'
  | 'risk'
  | 'segment'
  | 'status'
>

// This page is the detailed workspace for one CRM account.
export function CrmAccountPage() {
  // React Router reads :accountId from the URL, for example /crm/accounts/harbour-fresh.
  const { accountId } = useParams()
  const navigate = useNavigate()
  const { data: account, isLoading } = useCrmAccount(accountId ?? '')
  const updateAccount = useUpdateCrmAccount(accountId ?? '')
  const deleteAccount = useDeleteCrmAccount()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form, setForm] = useState<EditAccountForm | null>(null)

  if (isLoading) {
    // Show a small loading message while React Query waits for the API response.
    return <Text>Loading account...</Text>
  }

  if (!account) {
    // If the account cannot be found, send the user back to the account list.
    return <Navigate to="/crm/accounts" replace />
  }

  // The sample workflow advances further when an account needs review or is at risk.
  const activeRenewalStep = account.status === 'Active' ? 1 : 2

  async function handleUpdateAccount() {
    if (!account || !form) {
      return
    }

    await updateAccount.mutateAsync({
      // The modal only edits account summary fields, so we preserve the nested lists.
      ...form,
      missingInfo: account.missingInfo,
      contacts: account.contacts,
      policies: account.policies,
      claims: account.claims,
      tasks: account.tasks,
      documents: account.documents,
      activities: account.activities,
    })
    setIsEditOpen(false)
  }

  async function handleDeleteAccount() {
    if (!account) {
      return
    }

    await deleteAccount.mutateAsync(account.id)
    // After deletion, this detail page would no longer have a record to show.
    navigate('/crm/accounts')
  }

  return (
    <section className="page-stack">
      <Modal opened={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit CRM account">
        {form ? (
          <div className="crm-form-grid">
            {/* The edit modal writes into local form state until the broker clicks Save. */}
            <TextInput
              label="Account name"
              onChange={(event) => setForm({ ...form, name: event.currentTarget.value })}
              value={form.name}
            />
            <TextInput
              label="Owner"
              onChange={(event) => setForm({ ...form, owner: event.currentTarget.value })}
              value={form.owner}
            />
            <TextInput
              label="Segment"
              onChange={(event) => setForm({ ...form, segment: event.currentTarget.value })}
              value={form.segment}
            />
            <TextInput
              label="Renewal date"
              onChange={(event) => setForm({ ...form, renewalDate: event.currentTarget.value })}
              value={form.renewalDate}
            />
            <Select
              data={['Company', 'Individual', 'Partnership', 'Trust']}
              label="Entity type"
              onChange={(value) => setForm({ ...form, entityType: value ?? 'Company' })}
              value={form.entityType}
            />
            <Select
              data={['Active', 'Review', 'At risk']}
              label="Status"
              onChange={(value) =>
                setForm({ ...form, status: (value as EditAccountForm['status']) ?? 'Active' })
              }
              value={form.status}
            />
            <NumberInput
              label="Premium"
              min={0}
              onChange={(value) => setForm({ ...form, premium: Number(value) || 0 })}
              value={form.premium}
            />
            <NumberInput
              label="Revenue"
              min={0}
              onChange={(value) => setForm({ ...form, revenue: Number(value) || 0 })}
              value={form.revenue}
            />
            <NumberInput
              label="Compliance score"
              max={100}
              min={0}
              onChange={(value) => setForm({ ...form, complianceScore: Number(value) || 0 })}
              value={form.complianceScore}
            />
            <Textarea
              className="crm-form-span"
              label="Risk note"
              onChange={(event) => setForm({ ...form, risk: event.currentTarget.value })}
              value={form.risk}
            />
            <Textarea
              className="crm-form-span"
              label="AI summary"
              onChange={(event) => setForm({ ...form, aiSummary: event.currentTarget.value })}
              value={form.aiSummary}
            />
            <Button
              className="crm-form-span"
              leftSection={<IconDeviceFloppy size={18} />}
              loading={updateAccount.isPending}
              onClick={handleUpdateAccount}
            >
              Save changes
            </Button>
          </div>
        ) : null}
      </Modal>

      <PageHeader
        title={account.name}
        description={`${account.entityType} account · ${account.segment} · owner ${account.owner}`}
        actions={
          <Group gap="sm">
            <Button
              component={Link}
              leftSection={<IconArrowLeft size={18} />}
              to="/crm/accounts"
              variant="light"
            >
              Accounts
            </Button>
            <Button
              leftSection={<IconPencil size={18} />}
              onClick={() => {
                // Copy the editable fields into form state when the broker opens the modal.
                setForm({
                  aiSummary: account.aiSummary,
                  complianceScore: account.complianceScore,
                  entityType: account.entityType,
                  name: account.name,
                  owner: account.owner,
                  premium: account.premium,
                  renewalDate: account.renewalDate,
                  revenue: account.revenue,
                  risk: account.risk,
                  segment: account.segment,
                  status: account.status,
                })
                setIsEditOpen(true)
              }}
              variant="light"
            >
              Edit
            </Button>
            <Button
              color="red"
              leftSection={<IconTrash size={18} />}
              loading={deleteAccount.isPending}
              onClick={handleDeleteAccount}
              variant="light"
            >
              Delete
            </Button>
            <Button leftSection={<IconMail size={18} />}>Client email</Button>
          </Group>
        }
      />

      <div className="crm-account-hero">
        <Card className="crm-panel" padding="lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Badge color={crmStatusColors[account.status]} variant="light">
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
            {/* Contacts are nested inside the selected CRM account. */}
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
            {/* Timeline turns account activity records into a chronological story. */}
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
              {/* Policies are shown in a table because brokers compare these fields side by side. */}
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
