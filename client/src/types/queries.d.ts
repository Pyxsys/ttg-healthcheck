import {CpuDynamic, CpuProcess, CpuStatic} from './cpu';
import {DiskDynamic, DiskStatic} from './disk';
import {MemoryDynamic, MemoryProcess, MemoryStatic} from './memory';
import {WifiDynamic, WifiStatic} from './wifi';

export interface IResponse<T> {
  Results: T[]
  Total: number
}

export interface Device {
  deviceId: string
  name: string
  description: string
  connectionType: string
  status: string
  provider: string
  hardware: HardwareStatic
  cpu: CpuStatic
  memory: MemoryStatic
  disk: DiskStatic
  wifi: WifiStatic
}

export interface DeviceLog {
  deviceId: string
  timestamp: Date
  cpu: CpuDynamic
  memory: MemoryDynamic
  disk: DiskDynamic
  wifi: WifiDynamic
  processes: Process[]
}

export interface Process {
  name: string
  pid: number
  status: string
  cpu: CpuProcess
  memory: MemoryProcess
}

export interface HardwareStatic {
  harwareName: string
}
