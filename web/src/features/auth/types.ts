// These types describe the authentication data that moves between the frontend and API.
export type AuthUser = {
  email: string
  id: string
  name: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}
