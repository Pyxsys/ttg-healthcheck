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

export interface CpuStatic {
  baseSpeed: number
  sockets: number
  cores: number
  processors: number
  cacheSizeL1: number
  cacheSizeL2: number
  cacheSizeL3: number
}

export interface MemoryStatic {
  maxSize: number
  formFactor: string
}

export interface DiskStatic {
  capacity: number
  type: string
}

export interface WifiStatic {
  adapterName: string
  SSID: string
  connectionType: string
  ipv4Address: string
  ipv6Address: string
}

export interface CpuDynamic {
  usageSpeed: number
  numProcesses: number
  threadsSleeping: number
  aggregatedPercentage: number
}

export interface MemoryDynamic {
  inUse: number
  available: number
  cached: number
  aggregatedPercentage: number
}

export interface DiskDynamic {
  activeTimePercent: number
  responseTime: number
  readSpeed: number
  writeSpeed: number
}

export interface WifiDynamic {
  sendSpeed: number
  receiveSpeed: number
  signalStrength: string
}

export interface CpuProcess {
  usagePercentage: number
}

export interface MemoryProcess {
  usagePercentage: number
}
