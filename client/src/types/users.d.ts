export interface UserResponse {
  message: string
  user: {
    name: string
    role: string
  }
}

export interface UserObject {
  _id: string
  name: string
  role: string
}
