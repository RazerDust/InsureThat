import { axiosClient } from '../../api/axiosClient'
import { crmAccounts } from './data'
import type { CrmAccount } from './data'

export type SaveCrmAccountPayload = Omit<CrmAccount, 'id'>

// The backend now exposes the CRM accounts collection at this route.
const crmAccountsRoute = '/crm/accounts'

export async function listCrmAccounts() {
  try {
    const { data } = await axiosClient.get<CrmAccount[]>(crmAccountsRoute)
    return data
  } catch {
    // If the API is not running yet, keep the screen useful with local sample data.
    return crmAccounts
  }
}

export async function getCrmAccount(accountId: string) {
  try {
    const { data } = await axiosClient.get<CrmAccount>(`${crmAccountsRoute}/${accountId}`)
    return data
  } catch {
    return crmAccounts.find((account) => account.id === accountId) ?? null
  }
}

export async function createCrmAccount(payload: SaveCrmAccountPayload) {
  const { data } = await axiosClient.post<CrmAccount>(crmAccountsRoute, payload)
  return data
}

export async function updateCrmAccount(accountId: string, payload: SaveCrmAccountPayload) {
  const { data } = await axiosClient.put<CrmAccount>(`${crmAccountsRoute}/${accountId}`, payload)
  return data
}

export async function deleteCrmAccount(accountId: string) {
  await axiosClient.delete(`${crmAccountsRoute}/${accountId}`)
}
