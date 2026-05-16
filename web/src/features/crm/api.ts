import { axiosClient } from '../../api/axiosClient'
import { crmAccounts } from './data'
import type { CrmAccount, CrmContact } from './data'

// This payload is the account shape the API needs when creating or updating a record.
export type SaveCrmAccountPayload = Omit<CrmAccount, 'id'>
export type SaveCrmContactPayload = CrmContact

export type CrmContactRecord = CrmContact & {
  accountId: string
  accountName: string
  accountSegment: string
  accountOwner: string
}

// The backend now exposes the CRM accounts collection at this route.
const crmAccountsRoute = '/crm/accounts'
const crmContactsRoute = '/crm/contacts'

// Load every CRM account for the overview page.
export async function listCrmAccounts() {
  try {
    const { data } = await axiosClient.get<CrmAccount[]>(crmAccountsRoute)
    return data
  } catch {
    // If the API is not running yet, keep the screen useful with local sample data.
    return crmAccounts
  }
}

// Load one CRM account for the detailed account workspace.
export async function getCrmAccount(accountId: string) {
  try {
    const { data } = await axiosClient.get<CrmAccount>(`${crmAccountsRoute}/${accountId}`)
    return data
  } catch {
    return crmAccounts.find((account) => account.id === accountId) ?? null
  }
}

// Create a new account through the API.
export async function createCrmAccount(payload: SaveCrmAccountPayload) {
  const { data } = await axiosClient.post<CrmAccount>(crmAccountsRoute, payload)
  return data
}

// Save changes to an existing account.
export async function updateCrmAccount(accountId: string, payload: SaveCrmAccountPayload) {
  const { data } = await axiosClient.put<CrmAccount>(`${crmAccountsRoute}/${accountId}`, payload)
  return data
}

// Delete an account by id.
export async function deleteCrmAccount(accountId: string) {
  await axiosClient.delete(`${crmAccountsRoute}/${accountId}`)
}

// Load every contact as a flat list for the standalone Contacts menu page.
export async function listCrmContacts() {
  try {
    const { data } = await axiosClient.get<CrmContactRecord[]>(crmContactsRoute)
    return data
  } catch {
    // The fallback mirrors the backend shape by adding account details to each nested contact.
    return crmAccounts.flatMap((account) =>
      account.contacts.map((contact) => ({
        ...contact,
        accountId: account.id,
        accountName: account.name,
        accountSegment: account.segment,
        accountOwner: account.owner,
      })),
    )
  }
}

// Save changes to a contact that belongs to a specific account.
export async function updateCrmContact(
  accountId: string,
  contactId: string,
  payload: SaveCrmContactPayload,
) {
  const { data } = await axiosClient.put<CrmContactRecord>(
    `${crmContactsRoute}/${accountId}/${contactId}`,
    payload,
  )
  return data
}

// Delete a contact from its parent account.
export async function deleteCrmContact(accountId: string, contactId: string) {
  await axiosClient.delete(`${crmContactsRoute}/${accountId}/${contactId}`)
}
