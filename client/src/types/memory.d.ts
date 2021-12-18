
export interface MemoryStatic {
  maxSize: number
  formFactor: string
}

export interface MemoryDynamic {
  inUse: number
  available: number
  cached: number
  aggregatedPercentage: number
}
export interface MemoryProcess {
  usagePercentage: number
}
