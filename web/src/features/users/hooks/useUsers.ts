import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBrokerage,
  getAdministrationSnapshot,
  updateUserPermission,
  updateUserRole,
} from '../api'
import type {
  CreateBrokerageRequest,
  UpdateUserPermissionRequest,
  UpdateUserRoleRequest,
} from '../types'

const administrationQueryKey = (actingUserId: string) =>
  ['administration', actingUserId] as const

export function useAdministrationSnapshot(actingUserId: string) {
  return useQuery({
    queryKey: administrationQueryKey(actingUserId),
    queryFn: () => getAdministrationSnapshot(actingUserId),
  })
}

export function useCreateBrokerage(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBrokerageRequest) =>
      createBrokerage(actingUserId, payload),
    onSuccess: async () => {
      // Refresh the page data so the new tenant and audit entry appear straight away.
      await queryClient.invalidateQueries({
        queryKey: administrationQueryKey(actingUserId),
      })
      notifications.show({
        color: 'teal',
        message: 'Brokerage created and audit log updated.',
        title: 'Tenant saved',
      })
    },
  })
}

export function useUpdateUserRole(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      payload: UpdateUserRoleRequest
      userId: string
    }) => updateUserRole(actingUserId, userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: administrationQueryKey(actingUserId),
      })
      notifications.show({
        color: 'teal',
        message: 'The user now receives permissions from the updated role.',
        title: 'Role updated',
      })
    },
  })
}

export function useUpdateUserPermission(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      payload: UpdateUserPermissionRequest
      userId: string
    }) => updateUserPermission(actingUserId, userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: administrationQueryKey(actingUserId),
      })
      notifications.show({
        color: 'teal',
        message: 'The permission change is visible in the audit trail.',
        title: 'Permission updated',
      })
    },
  })
}
