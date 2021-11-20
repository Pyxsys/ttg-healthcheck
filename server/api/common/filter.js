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

const filterData = (query) => {
  const options = {}
  const queryOutput = {}

  for (let k in query) {
    query[k] = query[k].split(',')
    if (stringAttributes.includes(k)) {
      queryOutput[String(k)] = query[k]
    }
    if (numberAttributes.includes(k)) {
      queryOutput[String(k)] = query[k].map(Number)
    }
  }
  if (queryOutput.limit) {
    options.limit = queryOutput.limit
    delete queryOutput.limit
  }
  if (queryOutput.orderBy) {
    var orderBy = queryOutput.orderBy
    delete queryOutput.orderBy
  }
  if (queryOutput.orderValue) {
    var orderValue = queryOutput.orderValue
    delete queryOutput.orderValue
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
  return [queryOutput, options]
}

const validateTimestamp = (start, end) => {
  if (!start || !end) {
    throw new Error('must include startTimeStamp and endTimestamp')
  }
}

const filterTimestampQuery = (query) => {
  const [filteredQuery, options] = filterData(query)
  validateTimestamp(query.startTimeStamp, query.endTimeStamp)
  const queryOutput = {
    ...filteredQuery,
    timestamp: {
      $gte: String(query.startTimeStamp),
      $lte: String(query.endTimeStamp),
    },
  }
  return [queryOutput, options]
}

module.exports = { filterData, validateTimestamp, filterTimestampQuery }
