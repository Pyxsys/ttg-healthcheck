export interface IResponse<T> {
  Results: T[]
  Total: number
}

export interface IQuery {
  limit?: number
  skip?: number
  orderBy?: string
  Total?: boolean
}
