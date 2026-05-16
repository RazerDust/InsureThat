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

// The acting user id is part of the key because each admin can see different rows.
const administrationQueryKey = (actingUserId: string) =>
  ['administration', actingUserId] as const

// Load brokerages, users, roles, teams, offices, audit entries, and security notes together.
export function useAdministrationSnapshot(actingUserId: string) {
  return useQuery({
    queryKey: administrationQueryKey(actingUserId),
    queryFn: () => getAdministrationSnapshot(actingUserId),
  })
}

// Create a brokerage, refresh the visible snapshot, and tell the user it worked.
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

// Update a user's role and reload the admin table so permissions stay accurate.
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

// Toggle a single direct permission and then refresh the audit trail.
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
