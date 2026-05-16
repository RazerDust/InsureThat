// These types mirror the administration DTOs returned by the API.
// Having them in TypeScript helps the editor warn us when the frontend and backend disagree.
export type AdministrationSnapshot = {
  auditLog: AuditLogEntry[]
  brokerages: Brokerage[]
  currentUser: CurrentAdministrator
  offices: Office[]
  roles: Role[]
  securityRules: string[]
  teams: Team[]
  users: AdminUser[]
}

export type CurrentAdministrator = {
  brokerageId: string
  crossTenantBrokerageIds: string[]
  id: string
  isSystemAdministrator: boolean
  name: string
}

export type Brokerage = {
  defaultWorkflow: string
  id: string
  name: string
  region: string
  reportingBoundary: string
  status: string
  templateCount: number
  userCount: number
}

export type AdminUser = {
  brokerageId: string
  brokerageName: string
  crossTenantBrokerageIds: string[]
  email: string
  id: string
  lastActiveAt: string
  name: string
  office: string
  permissions: string[]
  roleId: string
  roleName: string
  status: string
  team: string
}

// Older user screens still expect this smaller user shape.
// Keeping it here lets the admin model grow without breaking those pages.
export type UserRole = string

export type UserSummary = {
  email: string
  id: string
  lastActiveAt: string
  name: string
  role: UserRole
}

export type Role = {
  brokerageId: string
  description: string
  id: string
  name: string
  permissions: string[]
  userCount: number
}

export type Team = {
  brokerageId: string
  id: string
  lead: string
  name: string
  userCount: number
}

export type Office = {
  brokerageId: string
  id: string
  location: string
  name: string
  userCount: number
}

export type AuditLogEntry = {
  action: string
  actorName: string
  actorUserId: string
  brokerageId: string
  brokerageName: string
  details: string
  id: string
  target: string
  timestamp: string
}

export type CreateBrokerageRequest = {
  defaultWorkflow: string
  name: string
  region: string
}

export type UpdateUserRoleRequest = {
  roleId: string
}

export type UpdateUserPermissionRequest = {
  isGranted: boolean
  permission: string
}
