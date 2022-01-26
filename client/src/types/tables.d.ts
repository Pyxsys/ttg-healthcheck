import {Device, DeviceLog} from './queries';

export interface DevicesColumns {
  id: string
  location?: string
  cpuUsage: number
  memoryUsage: number
  diskUsage?: number
  uptime: number
}

export interface TableDevice {
  static: Device
  dynamic?: DeviceLog
}
