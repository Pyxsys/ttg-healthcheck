const mongoose = require('mongoose')
const WebSocket = require('ws')
const request = require('supertest')

const connectDB = require('../db/db_connection')
const User = require('../models/user.js')
const app = require('../app')
const { createWebSocketServer, listeningForClients } = require('../ws_server')
const {
  monitorPredefinedCollections,
  closeMonitoredCollection,
  monitorCollection,
  numOfMonitoredChangeStream,
} = require('../db/change_streams')

const PORT = 8081
const collectionName = 'users'

const testValues = {
  httpServer: null,
  wsServer: null,
  wsClient: null,
}

const testUser = {
  name: process.env.USERNAME,
  password: process.env.PASSWORD,
  email: process.env.EMAIL,
  role: 'user',
}

beforeAll(async () => {
  // create http server
  await new Promise(
    (res) => (testValues.httpServer = app.listen(PORT, () => res()))
  )
  // create web socket server
  testValues.wsServer = createWebSocketServer(testValues.httpServer)
  listeningForClients(testValues.wsServer)

  // connect to local_db
  await connectDB()

  await User.deleteMany()
})

describe('Insert a new user to the database and get data from the change stream', () => {
  beforeAll(() => {
    monitorCollection(collectionName)
  })

  it('should receive the inserted data from the websocket', async () => {
    testValues.wsClient = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collectionName}`
    )
    await new Promise((res) => testValues.wsClient.on('open', () => res()))

    await request(app)
      .post('/api/user/register')
      .send({
        name: testUser.name,
        password: testUser.password,
        email: testUser.email,
        role: testUser.role,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })

    const dataStr = await new Promise((resolve) => {
      testValues.wsClient.onmessage = (event) => resolve(event.data)
    })

    try {
      const dataObj = JSON.parse(dataStr)
      expect(dataObj && dataObj.constructor === Object).toBeTruthy()
      expect(dataObj.fullDocument).toBeDefined()
      expect(dataObj.operationType).toBe('insert')
    } catch (err) {
      expect(err).toBeFalsy()
    }
  })

  afterAll(() => {
    if (testValues.wsClient) {
      testValues.wsClient.close()
      testValues.wsClient = null
    }

    closeMonitoredCollection()
  })
})

describe('Closes the collection change streams', () => {
  afterEach(async () => {
    closeMonitoredCollection()
  })

  it('should close one collection change stream', async () => {
    monitorCollection('new_collection_1')
    monitorCollection('new_collection_2')
    const numOfChangeStreams = numOfMonitoredChangeStream()
    closeMonitoredCollection('new_collection_1')
    expect(numOfMonitoredChangeStream()).toBe(numOfChangeStreams - 1)
  })

  it('should close all the collection change streams', async () => {
    monitorPredefinedCollections()
    expect(numOfMonitoredChangeStream()).not.toBe(0)
    closeMonitoredCollection()
    expect(numOfMonitoredChangeStream()).toBe(0)
  })
})

afterAll(async () => {
  // Close servers
  if (testValues.wsServer) {
    testValues.wsServer.close()
    testValues.wsServer = null
  }
  if (testValues.httpServer) {
    testValues.httpServer.close()
    testValues.httpServer = null
  }

  // Closing the DB connection allows Jest to exit successfully.
  await mongoose.connection.close()
})
