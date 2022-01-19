const request = require('supertest')
const mongoose = require('mongoose')
const WebSocket = require('ws')

const app = require('../app')
const { mockLogPayload1 } = require('./api/common.test')
const {
  createWebSocketServer,
  listenForClients,
  onClientConnection,
} = require('../ws_server')
const { closeMonitoredCollection } = require('../db/changeStreams')
const { clearClientConnectionFns, clientConnectionFns } =
  require('../ws_server').test
const connectDB = require('../db/db_connection')
const {
  connectClientsToRealTimeData,
  monitorRealTimeDataCollections,
} = require('../realTimeData/realTimeData')
const {
  addClient,
  removeClient,
  clearClients,
  addDeviceIds,
  resetDeviceIds,
  getClients,
  getRealTimeDataClients,
  getQueryStringParams,
  parseMessage,
} = require('../realTimeData/realTimeData').test

const PORT = 8081

const client1Id = 'CLIENT-1'
const client2Id = 'CLIENT-2'
const deviceId1 = 'TEST1-DEVICE'
const deviceId2 = 'TEST2-DEVICE'

let httpServer = null
let wsServer = null

beforeAll((done) => {
  httpServer = app.listen(PORT, () => done())
  wsServer = createWebSocketServer(httpServer)
})

describe('Updating the client subscriptions to different device Ids', () => {
  beforeEach(async () => {
    clearClients()
  })

  it('should add a new client to subscription with no device Ids', async () => {
    const newSubscriptions = addClient(client1Id)
    expect(newSubscriptions.length).toBe(1)
    expect(newSubscriptions[0].deviceIds.length).toBe(0)
  })

  it('should add a new client to subscription with 1 device Id', async () => {
    const newSubscriptions = addClient(client1Id, [deviceId1])
    expect(newSubscriptions.length).toBe(1)
    expect(newSubscriptions[0].deviceIds.length).toBe(1)
    expect(newSubscriptions[0].deviceIds[0]).toBe(deviceId1)
  })

  it('should append another device Id to the existing client', async () => {
    addClient(client1Id, [deviceId1])
    const updatedSubscriptions = addDeviceIds(client1Id, [deviceId2])
    expect(updatedSubscriptions.length).toBe(1)
    expect(updatedSubscriptions[0].deviceIds).toMatchObject([
      deviceId1,
      deviceId2,
    ])
  })

  it('should replace device Id to the existing client', async () => {
    addClient(client1Id, [deviceId1, deviceId2])
    const replacedSubscriptions = resetDeviceIds(client1Id, [deviceId2])
    expect(replacedSubscriptions.length).toBe(1)
    expect(replacedSubscriptions[0].deviceIds.length).toBe(1)
    expect(replacedSubscriptions[0].deviceIds[0]).toBe(deviceId2)
  })

  it('should remove all device Ids to the existing client', async () => {
    addClient(client1Id, [deviceId1, deviceId2])
    const removedSubscriptions = resetDeviceIds(client1Id)
    expect(removedSubscriptions.length).toBe(1)
    expect(removedSubscriptions[0].deviceIds.length).toBe(0)
  })

  it('should remove the client', async () => {
    addClient(client1Id, [deviceId1, deviceId2])
    const removedSubscriptions = removeClient(client1Id)
    expect(removedSubscriptions.length).toBe(0)
  })

  it('should remove all clients', async () => {
    addClient(client1Id, [deviceId1, deviceId2])
    addClient(client2Id, [deviceId1, deviceId2])
    const clearedSubscriptions = clearClients()
    expect(clearedSubscriptions.length).toBe(0)
  })

  it('should get clients that observe a given device Id', async () => {
    addClient(client1Id, [deviceId1])
    addClient(client2Id, [deviceId2])
    const clearedSubscriptions = getClients(deviceId1)
    expect(clearedSubscriptions.length).toBe(1)
    expect(clearedSubscriptions[0]).toBe(client1Id)
  })
})

describe('Parsing messages from the client', () => {
  beforeAll(async () => {
    clearClients()
    addClient(client1Id)
  })

  it('should successfully add a device to the client', async () => {
    const addCommand = 'add-devices'
    const addMessage = `${addCommand}?deviceIds=${deviceId1}`
    const response = parseMessage(client1Id, addMessage)
    expect(response).toBe('Success: devices added')
  })

  it('should fail to add a device due to missing device Id parameter', async () => {
    const addCommand = 'add-devices'
    const response = parseMessage(client1Id, `${addCommand}`)
    expect(response).toBe(
      'Error: "add-device" command requires "deviceIds" parameter'
    )
  })

  it('should successfully clear devices to the client', async () => {
    const clearCommand = 'clear-devices'
    const response = parseMessage(client1Id, `${clearCommand}`)
    expect(response).toBe('Success: devices cleared')
  })

  it('should successfully replace devices to the client', async () => {
    const replaceCommand = 'clear-devices'
    const replaceMessage = `${replaceCommand}?deviceIds=${deviceId1}`
    const response = parseMessage(client1Id, replaceMessage)
    expect(response).toBe('Success: devices replaced')
  })

  it('should successfully replace devices to the client', async () => {
    const invalidCommand = 'invalid-command'
    const invalidMessage = `${invalidCommand}?deviceIds=${deviceId1}`
    const response = parseMessage(client1Id, invalidMessage)
    expect(response).toBe(`Error: invalid command "${invalidCommand}"`)
  })
})

describe('Parse query parameters from url', () => {
  it('should successfully retrieve value based on param', async () => {
    const param = 'param1'
    const value = 'value1'
    const url = `?${param}=${value}`
    const result = getQueryStringParams(param, url)

    expect(result).toBe(value)
  })

  it('should not retrieve any value based on incorrect param', async () => {
    const param = 'param1'
    const value = 'value1'
    const url = `?${param}=${value}`
    const result = getQueryStringParams('incorrect param', url)

    expect(result).toBe(null)
  })
})

describe('Connecting a client to the web socket server for real time data', () => {
  let wsClient = null
  const connectClientForTest = async (url) => {
    expect(clientConnectionFns.length).toBe(1)
    expect(getRealTimeDataClients().length).toBe(0)

    wsClient = new WebSocket(`ws://localhost:${PORT}/?${url}`)
    await new Promise((res) => wsClient.on('open', () => res()))
  }

  beforeAll(async () => {
    clearClientConnectionFns()

    wsServer.removeAllListeners('connection')
    listenForClients(wsServer)
    connectClientsToRealTimeData()
  })

  beforeEach(async () => {
    clearClients()
  })

  afterEach(async () => {
    if (wsClient) {
      wsClient.close()
      await new Promise((res) => wsClient.on('close', () => res()))
      wsClient = null
    }
  })

  it('should connect client to subscription with 1 device Id', async () => {
    const oneDeviceUrl = `reason=realTime&deviceIds=${deviceId1}`
    await connectClientForTest(oneDeviceUrl)

    const oneClientOneDevice = getRealTimeDataClients()
    expect(oneClientOneDevice.length).toBe(1)
    expect(oneClientOneDevice[0].deviceIds.length).toBe(1)
  })

  it('should connect client to subscription with 0 device Ids', async () => {
    const noDeviceUrl = `reason=realTime`
    await connectClientForTest(noDeviceUrl)

    const oneClientNoDevice = getRealTimeDataClients()
    expect(oneClientNoDevice.length).toBe(1)
    expect(oneClientNoDevice[0].deviceIds.length).toBe(0)
  })

  it('should not connect client to real time data', async () => {
    const invalidReasonUrl = `reason=invalid`
    await connectClientForTest(invalidReasonUrl)

    const noClient = getRealTimeDataClients()
    expect(noClient.length).toBe(0)
  })

  it('should connect and succefully execute an add device message', async () => {
    const oneDeviceUrl = `reason=realTime&deviceIds=${deviceId1}`
    await connectClientForTest(oneDeviceUrl)

    wsClient.send(`add-devices?deviceIds=${deviceId2}`)
    await new Promise((res) =>
      wsClient.on('message', (msg) => {
        const messageString = `${msg}`
        expect(messageString).toBe('message - Success: devices added')
        res()
      })
    )

    const subscriptions = getRealTimeDataClients()
    expect(subscriptions.length).toBe(1)
    expect(subscriptions[0].deviceIds.length).toBe(2)
  })

  it('should connect and unsuccefully execute an invalid message', async () => {
    const oneDeviceUrl = `reason=realTime&deviceIds=${deviceId1}`
    await connectClientForTest(oneDeviceUrl)

    wsClient.send(`invalid?deviceIds=${deviceId2}`)
    await new Promise((res) =>
      wsClient.on('message', (msg) => {
        const messageString = `${msg}`
        expect(messageString).toBe('message - Error: invalid command "invalid"')
        res()
      })
    )

    const subscriptions = getRealTimeDataClients()
    expect(subscriptions.length).toBe(1)
    expect(subscriptions[0].deviceIds.length).toBe(1)
  })

  it('should disconnect client', async () => {
    const oneDeviceUrl = `reason=realTime`
    await connectClientForTest(oneDeviceUrl)

    expect(getRealTimeDataClients().length).toBe(1)

    wsClient.close()
    await new Promise((res) => wsClient.on('close', () => res()))
    wsClient = null

    await new Promise((res) => setTimeout(() => res(), 500))
    expect(getRealTimeDataClients().length).toBe(0)
  })
})

describe('Sending real time data to a connected client', () => {
  let wsClient = null

  beforeAll(async () => {
    closeMonitoredCollection()
    clearClientConnectionFns()

    await connectDB().then(() => {
      monitorRealTimeDataCollections()
    })

    wsServer.removeAllListeners('connection')
    listenForClients(wsServer)
    onClientConnection((client) => {
      addClient(client, [mockLogPayload1.deviceId])
    })

    wsClient = new WebSocket(`ws://localhost:${PORT}`)
    await new Promise((res) => wsClient.on('open', () => res()))
  })

  it('should receive DeviceLog data from web socket', (done) => {
    wsClient.onmessage = (msg) => {
      const deviceLogString = msg.data
      const deviceLog = JSON.parse(deviceLogString)

      expect(deviceLog.deviceId).toBeTruthy()
      expect(deviceLog.deviceId).toBe(mockLogPayload1.deviceId)
    }

    request(app)
      .post('/api/daemon')
      .send(mockLogPayload1)
      .then((deviceLogResponse) => {
        expect(deviceLogResponse.statusCode).toBe(200)
        done()
      })
  })

  it('should not send DeviceLog data to closed clients', async () => {
    wsClient.close()
    await new Promise((res) => wsClient.on('close', () => res()))

    expect(wsClient.readyState).toBe(WebSocket.CLOSED)

    const deviceLogResponse = await request(app)
      .post('/api/daemon')
      .send(mockLogPayload1)
    expect(deviceLogResponse.statusCode).toBe(200)

    await expect(
      new Promise(async (res) => {
        wsClient.onmessage = (event) => res(event.data)
        await new Promise((r) => setTimeout(r, 50))
        res('no message received')
      })
    ).resolves.toBe('no message received')
    wsClient = null
  })

  afterAll(async () => {
    if (wsClient) {
      wsClient.close()
      await new Promise((res) => wsClient.on('close', () => res()))
      wsClient = null
    }

    closeMonitoredCollection()
    await mongoose.connection.close()
  })
})

afterAll(async () => {
  // Close servers if open
  if (wsServer) {
    wsServer.close()
    wsServer = null
  }
  if (httpServer) {
    httpServer.close()
    httpServer = null
  }
})
