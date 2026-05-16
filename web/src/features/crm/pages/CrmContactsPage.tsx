import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconBuildingSkyscraper,
  IconDeviceFloppy,
  IconPencil,
  IconSearch,
  IconTrash,
  IconUserCheck,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import type { CrmContact } from '../data'
import type { CrmContactRecord } from '../api'
import { useCrmContacts, useDeleteCrmContact, useUpdateCrmContact } from '../hooks'

type ContactFormState = CrmContact

const influenceOptions: CrmContact['influence'][] = [
  'Decision maker',
  'Approver',
  'Operational',
  'Finance',
]

export function CrmContactsPage() {
  const { data: contacts = [] } = useCrmContacts()
  const updateContact = useUpdateCrmContact()
  const deleteContact = useDeleteCrmContact()
  const [search, setSearch] = useState('')
  const [editingContact, setEditingContact] = useState<CrmContactRecord | null>(null)
  const [form, setForm] = useState<ContactFormState | null>(null)

  const visibleContacts = useMemo(() => {
    const lowerSearch = search.toLowerCase()

    // Search checks both contact details and account details so brokers can find people quickly.
    return contacts.filter((contact) => {
      return (
        contact.name.toLowerCase().includes(lowerSearch) ||
        contact.role.toLowerCase().includes(lowerSearch) ||
        contact.email.toLowerCase().includes(lowerSearch) ||
        contact.accountName.toLowerCase().includes(lowerSearch)
      )
    })
  }, [contacts, search])

  const totalContacts = contacts.length

  function openEditModal(contact: CrmContactRecord) {
    // Copy the selected contact into form state so typing does not change the table until Save.
    setEditingContact(contact)
    setForm({
      id: contact.id,
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      influence: contact.influence,
    })
  }

  async function handleUpdateContact() {
    if (!editingContact || !form) {
      return
    }

    await updateContact.mutateAsync({
      accountId: editingContact.accountId,
      contactId: editingContact.id,
      payload: form,
    })

    setEditingContact(null)
    setForm(null)
  }

  async function handleDeleteContact(contact: CrmContactRecord) {
    await deleteContact.mutateAsync({
      accountId: contact.accountId,
      contactId: contact.id,
    })
  }

  return (
    <section className="page-stack">
      <Modal
        opened={Boolean(editingContact)}
        onClose={() => {
          setEditingContact(null)
          setForm(null)
        }}
        title="Edit contact"
      >
        {form ? (
          <div className="crm-form-grid">
            {/* Each input updates local form state; the backend is only called when Save is clicked. */}
            <TextInput
              label="Name"
              onChange={(event) => setForm({ ...form, name: event.currentTarget.value })}
              value={form.name}
            />
            <TextInput
              label="Role"
              onChange={(event) => setForm({ ...form, role: event.currentTarget.value })}
              value={form.role}
            />
            <TextInput
              label="Email"
              onChange={(event) => setForm({ ...form, email: event.currentTarget.value })}
              value={form.email}
            />
            <TextInput
              label="Phone"
              onChange={(event) => setForm({ ...form, phone: event.currentTarget.value })}
              value={form.phone}
            />
            <Select
              className="crm-form-span"
              data={influenceOptions}
              label="Influence"
              onChange={(value) =>
                setForm({
                  ...form,
                  influence: (value as CrmContact['influence']) ?? 'Operational',
                })
              }
              value={form.influence}
            />
            <Button
              className="crm-form-span"
              disabled={!form.name || !form.email}
              leftSection={<IconDeviceFloppy size={18} />}
              loading={updateContact.isPending}
              onClick={handleUpdateContact}
            >
              Save contact
            </Button>
          </div>
        ) : null}
      </Modal>

      <PageHeader
        title="Contacts"
        description="A focused CRM view for client people, roles and account relationships."
        actions={
          <Button component={Link} leftSection={<IconBuildingSkyscraper size={18} />} to="/crm/accounts">
            Accounts
          </Button>
        }
      />

      <Card className="crm-panel" padding="lg">
        <Group justify="space-between" align="flex-start" mb="md">
          <div>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Contact directory
            </Text>
            <Title order={2}>CRM contacts</Title>
          </div>
          <Badge variant="light">{totalContacts} total</Badge>
        </Group>

        <TextInput
          aria-label="Search CRM contacts"
          leftSection={<IconSearch size={18} />}
          mb="md"
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search contacts, role, email or account"
          value={search}
        />

        <Table.ScrollContainer minWidth={780}>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Account</Table.Th>
                <Table.Th>Influence</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visibleContacts.map((contact) => (
                <Table.Tr key={`${contact.accountId}-${contact.id}`}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <IconUserCheck size={18} />
                      <div>
                        <Text fw={700}>{contact.name}</Text>
                        <Text size="sm" c="dimmed">
                          {contact.role} · {contact.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      component={Link}
                      fw={700}
                      to={`/crm/accounts/${contact.accountId}`}
                    >
                      {contact.accountName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {contact.accountSegment} · owner {contact.accountOwner}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline">{contact.influence}</Badge>
                  </Table.Td>
                  <Table.Td>{contact.phone}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end" wrap="nowrap">
                      <Tooltip label="Edit contact">
                        <ActionIcon
                          aria-label={`Edit ${contact.name}`}
                          onClick={() => openEditModal(contact)}
                          variant="subtle"
                        >
                          <IconPencil size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete contact">
                        <ActionIcon
                          aria-label={`Delete ${contact.name}`}
                          color="red"
                          loading={deleteContact.isPending}
                          onClick={() => handleDeleteContact(contact)}
                          variant="subtle"
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {visibleContacts.length === 0 ? (
          <Stack align="center" py="xl">
            <Text fw={700}>No contacts found</Text>
            <Text c="dimmed">Try a different search term.</Text>
          </Stack>
        ) : null}
      </Card>
    </section>
  )
}
