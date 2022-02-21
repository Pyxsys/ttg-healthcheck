export interface IDiskStatic {
  capacity: number
  disks: IDiskStaticPhysical[]
}

interface IDiskStaticPhysical {
  type: string
  model: string
  size: number
}

export interface IDiskDynamic {
  partitions: IDiskDynamicPartition[]
  disks: IDiskDynamicPhysical[]
}

interface IDiskDynamicPartition {
  path: string
  percent: number
}

interface IDiskDynamicPhysical {
  responseTime: number
  readSpeed: number
  writeSpeed: number
}
