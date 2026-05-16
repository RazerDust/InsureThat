import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCrmAccount,
  deleteCrmAccount,
  getCrmAccount,
  listCrmAccounts,
  updateCrmAccount,
} from './api'
import type { SaveCrmAccountPayload } from './api'

// Every CRM query starts with the same key so we can refresh the whole CRM cache together.
const crmAccountsQueryKey = ['crm', 'accounts'] as const

// useCrmAccounts loads the list shown on the CRM overview page.
export function useCrmAccounts() {
  return useQuery({
    queryKey: crmAccountsQueryKey,
    queryFn: listCrmAccounts,
  })
}

// useCrmAccount loads the detail record once React Router gives us an account id.
export function useCrmAccount(accountId: string) {
  return useQuery({
    queryKey: [...crmAccountsQueryKey, accountId],
    queryFn: () => getCrmAccount(accountId),
    enabled: Boolean(accountId),
  })
}

// Mutations change data, then invalidate the list so the page reloads fresh data.
export function useCreateCrmAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCrmAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey }),
  })
}

// This hook saves edits made in the account detail modal.
export function useUpdateCrmAccount(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SaveCrmAccountPayload) => updateCrmAccount(accountId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey }),
  })
}

// This hook removes an account and then refreshes the CRM list.
export function useDeleteCrmAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCrmAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey }),
  })
}
