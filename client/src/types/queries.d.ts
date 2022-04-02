export interface IResponse<T> {
  Results: T[]
  Total: number
}

export interface IResponse1<T> {
  Results: T
}

export interface IQuery {
  limit?: number
  skip?: number
  orderBy?: string
  Total?: boolean
}
