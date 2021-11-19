// String attributes list to check with req.query object
const stringAttributes = [
  'orderBy',
  'deviceId',
  'name',
  'description',
  'connectionType',
  'status',
  'provider',
  'memory.formFactor',
  'hardware.hardwareName',
  'disk.type',
  'timestamp',
]

// Number attributes list to check with req.query object
const numberAttributes = [
  'limit',
  'orderValue',
  'cpu.baseSpeed',
  'cpu.sockets',
  'cpu.cores',
  'cpu.processors',
  'cpu.cacheSizeL1',
  'cpu.cacheSizeL2',
  'cpu.cacheSizeL3',
  'wifi.adapterName',
  'wifi.SSID',
  'wifi.connectionType',
  'wifi.ipv4Address',
  'wifi.ipv6Address',
  'memory.maxSize',
  'disk.capacity',
  'usagePercentage',
  'usageSpeed',
  'numProcesses',
  'threadsAlive',
  'threadsSleeping',
  'uptime',
  'sendSpeed',
  'receiveSpeed',
  'signalStrength',
  'inUse',
  'available',
  'cached',
  'pagedPool',
  'nonPagedPool',
  'activeTimePercent',
  'responseTime',
  'readSpeed',
  'writeSpeed',
]

const filterData = (req) => {
  let options = {}
  let query = {}
  let queryObj = Object(req)
  for (let k in queryObj) {
    queryObj[k] = queryObj[k].split(',')
    if (stringAttributes.includes(k)) {
      query[String(k)] = queryObj[k]
    }
    if (numberAttributes.includes(k)) {
      query[String(k)] = queryObj[k].map(Number)
    }
  }
  if (query.limit) {
    options.limit = query.limit
    delete query.limit
  }
  if (query.orderBy) {
    var orderBy = query.orderBy
    delete query.orderBy
  }
  if (query.orderValue) {
    var orderValue = query.orderValue
    delete query.orderValue
  }
  if (orderValue && orderBy) {
    options.sort = {
      [orderBy]: orderValue,
    }
  } else {
    options.sort = {
      timestamp: [-1],
    }

  }
  return [query, options]
}

const validateTimestamp = (start, end) => {
  if (!start || !end) {
    throw new Error('must include startTimeStamp and endTimestamp')
  }
}

module.exports = { filterData, validateTimestamp }
