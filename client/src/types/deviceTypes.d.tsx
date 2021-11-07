export interface CpuLog {
    deviceId: string
    usagePercentage: number
    usageSpeed: number
    numProcesses: number
    threadsAlive: number
    threadsSleeping: number
    uptime: number
    timestamp: Date
  }
  
  export interface MemoryLog {
    deviceId: string
    usagePercentage: number
    inUse: number
    available: number
    cached: number
    pagedPool: number
    nonPagedPool: number
    timestamp: Date
  }
  export interface DiskLog {
    deviceId: string
    activeTimePercent: number
    responseTime: number
    readSpeed: number
    writeSpeed: number
    timestamp: Date
  }
  
  export interface DeviceLog {
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
  export interface MemoryStatic {
    maxSize: number
    formFactor: string
  }
  export interface WifiLog {
    deviceId: string
    sendSpeed: number
    receiveSpeed: number
    signalStrength: string
    timestamp: Date
  }
  