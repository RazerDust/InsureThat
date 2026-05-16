import { axiosClient } from '../../api/axiosClient'
import { crmAccounts } from './data'
import type { CrmAccount } from './data'

// This payload is the account shape the API needs when creating or updating a record.
export type SaveCrmAccountPayload = Omit<CrmAccount, 'id'>

// The backend now exposes the CRM accounts collection at this route.
const crmAccountsRoute = '/crm/accounts'

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
