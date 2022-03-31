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
}

export interface IUserPassword {
  _id: string
  oldPassword?: string
  newPassword: string
  newPassword1: string
}

export interface IUserLogs {
  timestamp?: Date
  userPerformingAction?: String
  affectedUser?: String
  event?: String
  description?: String
}
