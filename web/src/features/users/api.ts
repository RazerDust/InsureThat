import { axiosClient } from '../../api/axiosClient'
import type {
  AdminUser,
  AdministrationSnapshot,
  Brokerage,
  CreateBrokerageRequest,
  UpdateUserPermissionRequest,
  UpdateUserRoleRequest,
} from './types'

// The backend uses this header to pretend a specific user is signed in during local development.
function actingUserHeaders(actingUserId: string) {
  // This local-development header lets us prove row-level security before real auth is connected.
  return {
    'X-Acting-User-Id': actingUserId,
  }
}

// Load the full administration snapshot for the selected acting user.
export async function getAdministrationSnapshot(actingUserId: string) {
  const { data } = await axiosClient.get<AdministrationSnapshot>('/admin', {
    headers: actingUserHeaders(actingUserId),
  })

  return data
}

// Create a new brokerage tenant.
export async function createBrokerage(
  actingUserId: string,
  payload: CreateBrokerageRequest,
) {
  const { data } = await axiosClient.post<Brokerage>('/admin/brokerages', payload, {
    headers: actingUserHeaders(actingUserId),
  })

  return data
}

// Change which role a user belongs to.
export async function updateUserRole(
  actingUserId: string,
  userId: string,
  payload: UpdateUserRoleRequest,
) {
  const { data } = await axiosClient.put<AdminUser>(
    `/admin/users/${userId}/role`,
    payload,
    { headers: actingUserHeaders(actingUserId) },
  )

  return data
}

// Grant or remove one direct permission for a user.
export async function updateUserPermission(
  actingUserId: string,
  userId: string,
  payload: UpdateUserPermissionRequest,
) {
  const { data } = await axiosClient.put<AdminUser>(
    `/admin/users/${userId}/permission`,
    payload,
    { headers: actingUserHeaders(actingUserId) },
  )

  return data
}
