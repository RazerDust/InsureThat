export type UserRole = 'admin' | 'broker' | 'member'

export type UserSummary = {
  email: string
  id: string
  lastActiveAt: string
  name: string
  role: UserRole
}
