import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCrmAccount,
  deleteCrmAccount,
  getCrmAccount,
  listCrmAccounts,
  updateCrmAccount,
} from './api'
import type { SaveCrmAccountPayload } from './api'

const crmAccountsQueryKey = ['crm', 'accounts'] as const

export function useCrmAccounts() {
  return useQuery({
    queryKey: crmAccountsQueryKey,
    queryFn: listCrmAccounts,
  })
}

export function useCrmAccount(accountId: string) {
  return useQuery({
    queryKey: [...crmAccountsQueryKey, accountId],
    queryFn: () => getCrmAccount(accountId),
    enabled: Boolean(accountId),
  })
}

export function useCreateCrmAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCrmAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey }),
  })
}

export function useUpdateCrmAccount(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SaveCrmAccountPayload) => updateCrmAccount(accountId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey }),
  })
}

export function useDeleteCrmAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCrmAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmAccountsQueryKey }),
  })
}
