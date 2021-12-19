export interface DiskStatic {
  capacity: number
  disks: DiskStaticPhysical[]
}

interface DiskStaticPhysical {
  type: string
  model: string
  size: number
}

export interface DiskDynamic {
  partitions: DiskDynamicPartition[]
  disks: DiskDynamicPhysical[]
}

interface DiskDynamicPartition {
  path: string
  percent: number
}

interface DiskDynamicPhysical {
  responseTime: number
  readSpeed: number
  writeSpeed: number
}
