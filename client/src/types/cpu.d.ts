export interface CpuStatic {
  baseSpeed: number
  sockets: number
  cores: number
  processors: number
  cacheSizeL1: number
  cacheSizeL2: number
  cacheSizeL3: number
}

export interface CpuDynamic {
  usageSpeed: number
  numProcesses: number
  threadsSleeping: number
  aggregatedPercentage: number
}

export interface CpuProcess {
  usagePercentage: number
}
