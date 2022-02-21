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
  filter?: boolean
  override?: (value: number | string | undefined, object: any) => JSX.Element
}
