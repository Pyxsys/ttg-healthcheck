const { WebSocket } = require('ws')
const { DeviceLogs } = require('../models/device_logs')
const { onClientConnection } = require('../ws_server')
const { monitorCollection } = require('../db/changeStreams')

/**
 * Collection of clients and the deviceIds that they wish to observe.
 * @type {{client: WebSocket; deviceIds: string[]}[]}
 */
let realTimeDataClients = []
const realTimeDataCollections = [DeviceLogs.collection.name]

/* -----------------
 * Setters
 * -----------------
 */

/**
 * Add a websocket client to get real time data for given device Ids.
 * @param {WebSocket} client
 * @param {string[]} deviceIds list of Pi devices to observe
 * @returns the updated client list
 */
const addClient = (client, deviceIds = []) => {
  //deviceIds = deviceIds?.length > 0 ? deviceIds : []
  if (deviceIds == null || deviceIds.length == 0) {
    deviceIds = []
  }
  realTimeDataClients.push({ client, deviceIds })
  return realTimeDataClients
}

/**
 * Remove a websocket client from the collection of client-deviceIds.
 * @param {WebSocket} client
 * @returns the updated client list
 */
const removeClient = (client) => {
  realTimeDataClients = realTimeDataClients.filter(
    (sub) => sub.client !== client
  )
  return realTimeDataClients
}

/**
 * Remove all websockets clients connected for real time data.
 * @returns the updated client list
 */
const clearClients = () => {
  realTimeDataClients.splice(0)
  return realTimeDataClients
}

/**
 * Add deviceIds for a websocket client to the collection of client-deviceIds.
 * @param {WebSocket} client
 * @param {string[]} deviceIds list of Pi devices to observe
 * @returns the updated client list
 */
const addDeviceIds = (client, deviceIds) => {
  const clientSub = realTimeDataClients.find((sub) => sub.client === client)
  clientSub.deviceIds.push(...deviceIds)
  return realTimeDataClients
}

/**
 * Remove all deiveIds for a websocket client to the collection of client-deviceIds.
 * If deviceIds are provided then they are added to the collection of client-deviceIds.
 * @param {WebSocket} client
 * @param {string[]} deviceIds (optional) list of Pi devices to observe
 * @returns the updated client list
 */
const resetDeviceIds = (client, deviceIds) => {
  const clientSub = realTimeDataClients.find((sub) => sub.client === client)
  clientSub.deviceIds = deviceIds ? deviceIds : []
  return realTimeDataClients
}

/* -----------------
 * Getters
 * -----------------
 */

/**
 * Returns the list of websocket clients observing a given Pi device.
 * @param {string[]} deviceId Pi device being observed
 * @returns the clients observing a specified Pi device
 */
const getClients = (deviceId) => {
  return realTimeDataClients
    .filter((sub) => sub.deviceIds.includes(deviceId))
    .map((sub) => sub.client)
}

/**
 * Returns the list of clients connected for real time data.
 * @returns the list of clients and their observered Pi devices
 */
const getRealTimeDataClients = () => {
  return realTimeDataClients
}

/* ----------------------
 * Connect to Websockets
 * ----------------------
 */

/**
 * When a client connects, if it requests real time data,
 * connect client to access real time data.
 */
const connectClientsToRealTimeData = () => {
  onClientConnection((client, additionalInfo) => {
    const reason = getQueryStringParams('reason', additionalInfo.url)
    if (reason === 'realTime') {
      const ids = getQueryStringParams('deviceIds', additionalInfo.url)
      connectRealTimeClient(client, ids ? ids.split(',') : [])
    }
  })
}

/**
 * Connect a websocket client for real time data.
 *
 * Add a client websocket to the collection of client-deviceIds. Remove
 * a client websocket from the collection of client-deviceIds when web
 * socket closes. Parse messages when messages are received from the client.
 * @param {WebSocket} client
 * @param {string[]} deviceIds list of Pi devices to observe
 */
const connectRealTimeClient = (client, deviceIds) => {
  addClient(client, deviceIds)

  // When ws client disconnects
  client.on('close', () => {
    removeClient(client)
  })

  // When receives a message from the ws client
  client.on('message', (msg) => {
    const response = parseMessage(client, `${msg}`)
    client.send(`message - ${response}`)
  })
}

/**
 * Parses messages from a websocket client and updates the collection
 * of client-deviceIds accordingly.
 * @param {WebSocket} client
 * @param {string} msg
 * @returns the success or error message
 */
const parseMessage = (client, msg) => {
  const [command] = msg.split('?')

  if (command === 'add-devices') {
    const ids = getQueryStringParams('deviceIds', msg)
    if (!ids) {
      return 'Error: "add-device" command requires "deviceIds" parameter'
    }
    addDeviceIds(client, ids.split(','))
    return 'Success: devices added'
  } else if (command === 'clear-devices') {
    const ids = getQueryStringParams('deviceIds', msg)
    resetDeviceIds(client, ids ? ids.split(',') : null)
    return `Success: devices ${ids ? 'replaced' : 'cleared'}`
  }
  return `Error: invalid command "${command}"`
}

/* ---------------------
 * Send Messages
 * ---------------------
 */

/**
 * Monitor the collections to notify clients when real time data
 * is received.
 */
const monitorRealTimeDataCollections = () => {
  realTimeDataCollections.forEach((dbCollection) => {
    monitorCollection(dbCollection, (change) => {
      const device = change.fullDocument
      const clients = getClients(device.deviceId)
      clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(device))
        }
      })
    })
  })
}

const getQueryStringParams = (params, url) => {
  const regEx = new RegExp('[?&]' + params + '=([^&#]*)')
  const value = regEx.exec(decodeURIComponent(url))
  return value ? value[1] : null
}

module.exports = {
  connectClientsToRealTimeData,
  monitorRealTimeDataCollections,

  test: {
    getQueryStringParams,
    getRealTimeDataClients,
    addClient,
    removeClient,
    addDeviceIds,
    resetDeviceIds,
    getClients,
    clearClients,
    parseMessage,
    connectRealTimeClient,
  },
}
