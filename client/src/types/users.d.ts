export interface IUserResponse {
  message: string
  user: {
    name: string
    role: string
  }
}

export interface IUserObject {
  _id: string
  name: string
  role: string
  avatar: string
  email?: string
  originalName?: string
  defaultAvatar?: boolean
}

export interface IUserPassword {
  _id: string
  oldPassword?: string
  newPassword: string
  newPassword1: string
}
