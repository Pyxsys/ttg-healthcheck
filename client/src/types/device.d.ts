import {ICpuDynamic, ICpuProcess, ICpuStatic} from './cpu';
import {IDiskDynamic, IDiskStatic} from './disk';
import {IMemoryDynamic, IMemoryProcess, IMemoryStatic} from './memory';
import {IWifiDynamic, IWifiStatic} from './wifi';

export interface IDevice {
  deviceId: string
  name: string
  description: string
  connectionType: string
  status: string
  provider: string
  hardware: IHardwareStatic
  cpu: ICpuStatic
  memory: IMemoryStatic
  disk: IDiskStatic
  wifi: IWifiStatic
}

export interface IDeviceLog {
  deviceId: string
  timestamp: Date
  cpu: ICpuDynamic
  memory: IMemoryDynamic
  disk: IDiskDynamic
  wifi: IWifiDynamic
  processes: IProcess[]
}

export interface IDeviceTotal {
  static: IDevice
  dynamic?: IDeviceLog
}

export interface IProcess {
  name: string
  pid: number
  status: string
  cpu: ICpuProcess
  memory: IMemoryProcess
}

export interface IHardwareStatic {
  harwareName: string
}
