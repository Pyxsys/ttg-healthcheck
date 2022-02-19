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
}
