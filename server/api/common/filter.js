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

  for (const k in query) {
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
  if (queryOutput.orderBy && queryOutput.orderValue) {
    const orderBy = queryOutput.orderBy
    const orderValue = queryOutput.orderValue
    options.sort = {
      [orderBy]: orderValue,
    }
    delete queryOutput.orderValue
    delete queryOutput.orderBy
  } else {
    options.sort = {
      timestamp: [-1],
    }
  }
  return [queryOutput, options]
}

const parseQuery = (query) => {
  const options = {}

  const paramKeyValue = Object.entries(query)
  const validParams = paramKeyValue.reduce((acc, val) => {
    const key = String(val[0])
    const value = stringAttributes.includes(key) ? String(val[1]) : (numberAttributes.includes(key) ? Number(val[1]) : null)
    if (value && !String(value).includes(' ')) {
      acc[key] = value
    }
    return acc
  }, {})
  
  if (validParams.limit) {
    options.limit = validParams.limit
    delete validParams.limit
  }

  if (validParams.orderBy) {
    const orderValue = validParams.orderBy.startsWith('-') ? 1 : -1
    const orderBy = orderValue < 0 ? validParams.orderBy.slice(1) : validParams.orderBy
    options.sort = {
      [orderBy]: orderValue,
    }
    delete validParams.orderValue
    delete validParams.orderBy
  } else {
    options.sort = {
      timestamp: [-1],
    }
  }
  return [validParams, options]
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
