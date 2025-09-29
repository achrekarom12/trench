export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  isDeleted: boolean
  deletedAt?: Date
}

export interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: Date
  isDeleted: boolean
  deletedAt?: Date
}

export interface UpdateUserInput {
  name?: string
  email?: string
}
