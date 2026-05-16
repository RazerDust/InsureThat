import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCrmAccount,
  deleteCrmContact,
  deleteCrmAccount,
  getCrmAccount,
  listCrmContacts,
  listCrmAccounts,
  updateCrmContact,
  updateCrmAccount,
} from './api'
import type { SaveCrmAccountPayload, SaveCrmContactPayload } from './api'

// Every CRM query starts with the same key so we can refresh the whole CRM cache together.
const crmAccountsQueryKey = ['crm', 'accounts'] as const
const crmContactsQueryKey = ['crm', 'contacts'] as const

// useCrmAccounts loads the list shown on the CRM overview page.
export function useCrmAccounts() {
  return useQuery({
    queryKey: crmAccountsQueryKey,
    queryFn: listCrmAccounts,
  })
}

// useCrmContacts loads the flattened contacts list shown on the Contacts page.
export function useCrmContacts() {
  return useQuery({
    queryKey: crmContactsQueryKey,
    queryFn: listCrmContacts,
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

// This hook saves edits for one contact inside one account.
export function useUpdateCrmContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      accountId,
      contactId,
      payload,
    }: {
      accountId: string
      contactId: string
      payload: SaveCrmContactPayload
    }) => updateCrmContact(accountId, contactId, payload),
    onSuccess: () => {
      // Contact edits affect both the contacts page and account detail pages.
      queryClient.invalidateQueries({ queryKey: crmContactsQueryKey })
      queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey })
    },
  })
}

// This hook removes one contact and refreshes any CRM screens that may show it.
export function useDeleteCrmContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ accountId, contactId }: { accountId: string; contactId: string }) =>
      deleteCrmContact(accountId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmContactsQueryKey })
      queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey })
    },
  })
}
