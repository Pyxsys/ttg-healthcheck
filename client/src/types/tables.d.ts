export interface IDevicesColumns {
  id: string
  location?: string
  cpuUsage: number
  memoryUsage: number
  diskUsage?: number
  uptime: number
}

export interface IColumnDetail {
  key: string
  name: string
  disableOrderBy?: boolean
  filter?: boolean
  override?: (value: number | string | undefined, object: any) => JSX.Element
}

export interface ViewTableInputs<T> {
  tableData: T[]
  columns: IColumnDetail[]
  page?: number
  pageSize?: number
  initialOrderBy?: string
}
