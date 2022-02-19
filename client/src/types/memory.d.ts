export interface IMemoryStatic {
  maxSize: number
  formFactor: string
}

export interface IMemoryDynamic {
  inUse: number
  available: number
  cached: number
  aggregatedPercentage: number
}
export interface IMemoryProcess {
  usagePercentage: number
}
