export interface ICpuStatic {
  baseSpeed: number
  sockets: number
  cores: number
  processors: number
  cacheSizeL1: number
  cacheSizeL2: number
  cacheSizeL3: number
}

export interface ICpuDynamic {
  usageSpeed: number
  numProcesses: number
  threadsSleeping: number
  aggregatedPercentage: number
}

export interface ICpuProcess {
  usagePercentage: number
}
