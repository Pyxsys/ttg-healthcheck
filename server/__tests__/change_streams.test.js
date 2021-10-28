const request = require('supertest')
const connectDB = require('../db/db_connection')
const User = require('../models/user.js')
const app = require('../app')
const mongoose = require('mongoose')
const WebSocket = require('ws')
const {
  createChangeStream,
  attachNotifyClients,
  monitorPredefinedCollections,
  closeMonitoredCollection,
} = require('../db/change_streams')
const { attachWSConnection } = require('../websocket')
const clientCollections = require('../db/ws_clients')

const PORT = 80
const collectionName = 'users'

const testValues = {
  wsServer: null,
  changeStream: null,
  wsClient: null,
}
const userOne = {
  name: 'test',
  password: 'test_password',
  email: 'test@gmail.com',
  role: 'user',
}

const closeWebSocket = () => {
  if (testValues.wsClient) {
    testValues.wsClient.close()
    testValues.wsClient = null
  }
}

beforeAll(async () => {
  // create websocket server
  testValues.wsServer = app.listen(PORT, () =>
    console.log(`Web socket listening on port ${PORT}`)
  )
  attachWSConnection(testValues.wsServer)

  // connect to local_db
  await connectDB().then(async () => {
    testValues.changeStream = await createChangeStream(collectionName)
    await attachNotifyClients(testValues.changeStream)
    await monitorPredefinedCollections()
  })

  await User.deleteMany()
})

describe('Insert a new user to the database', () => {
  it('should receive the inserted data from the websocket ', (done) => {
    closeWebSocket()
    testValues.wsClient = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collectionName}`
    )

    testValues.wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data)
      expect(data.fullDocument).toBeDefined()
      expect(data.operationType).toBe('insert')
      closeWebSocket()
      done()
    }

    request(app)
      .post('/api/user/register')
      .send(userOne)
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })
})

afterAll(async () => {
  // Close client web socket if hanging
  closeWebSocket()
  // Close change stream
  if (testValues.changeStream) {
    testValues.changeStream.close()
  }
  // Close predefined collections
  await closeMonitoredCollection(Object.keys(clientCollections)[0])
  await closeMonitoredCollection()

  // Close web socket server
  if (testValues.wsServer) {
    testValues.wsServer.close()
  }
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
})
