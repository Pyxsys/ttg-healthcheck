const app = require('../app')
const WebSocket = require('ws')
const { createWebSocketServer, listeningForClients } = require('../ws_server')
const {
  clientCollections,
  getCollectionsNames,
  notifyClients,
} = require('../db/collection_subject')

const PORT = 8081
const PORT_TEMP = 8091

const collection1 = 'test_collection_1'
const collection2 = 'test_collection_2'

const testValues = {
  httpServerGlobal: null,
  wsServerGlobal: null,
  httpServerTemp: null,
  wsServerTemp: null,

  wsClientTemp1: null,
  wsClientTemp2: null,
}

beforeAll((done) => {
  testValues.httpServerGlobal = app.listen(PORT, () => done())
})

afterEach(() => {
  if (testValues.httpServerTemp) {
    testValues.httpServerTemp.close()
    testValues.httpServerTemp = null
  }
  if (testValues.wsServerTemp) {
    testValues.wsServerTemp.close()
    testValues.wsServerTemp = null
  }
  if (testValues.wsClientTemp1) {
    testValues.wsClientTemp1.close()
    testValues.wsClientTemp1 = null
  }
  if (testValues.wsClientTemp2) {
    testValues.wsClientTemp2.close()
    testValues.wsClientTemp2 = null
  }
})

describe('Create Web Socket server', () => {
  it('should successfully create a Web Socket server', async () => {
    const wsServer = createWebSocketServer(testValues.httpServerGlobal)
    expect(wsServer).toBeDefined()
    wsServer.close()
  })
})

describe('Disconnect HTTP server', () => {
  it('should disconnect Web Socket server as well', async () => {
    testValues.httpServerTemp = await new Promise((resolve) => {
      const s = app.listen(PORT_TEMP, () => resolve(s))
    })
    testValues.wsServerTemp = createWebSocketServer(testValues.httpServerTemp)

    expect(testValues.httpServerTemp).not.toBeNull()
    expect(testValues.wsServerTemp).not.toBeNull()

    await expect(
      new Promise((resolve) => {
        testValues.wsServerTemp.on('close', () => {
          resolve('closed')
        })
        testValues.httpServerTemp.close()
        testValues.httpServerTemp = null
      })
    ).resolves.toBe('closed')
  })
})

describe('Attach/Detatch/Notify client Web Sockets To Collections', () => {
  beforeAll(() => {
    testValues.wsServerGlobal = createWebSocketServer(
      testValues.httpServerGlobal
    )
    listeningForClients(testValues.wsServerGlobal)
  })

  afterEach(() => {
    clientCollections[collection1] = []
    clientCollections[collection2] = []
  })

  it('should attach client to collection that exists', async () => {
    const collectionName = getCollectionsNames()[0]
    const numOfCollections = getCollectionsNames().length
    const numOfClients = clientCollections[collectionName]
      ? clientCollections[collectionName].length
      : 0

    testValues.wsClientTemp1 = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collectionName}`
    )
    await new Promise((res) => testValues.wsClientTemp1.on('open', () => res()))

    expect(getCollectionsNames().length).toBe(numOfCollections)
    expect(clientCollections[collectionName].length).toBe(numOfClients + 1)

    clientCollections[collectionName] = []
  })

  it('should attach client to collection that does not exist', async () => {
    const collectionName = 'new_collection'
    const numOfCollections = getCollectionsNames().length
    const numOfClients = clientCollections[collectionName]
      ? clientCollections[collectionName].length
      : 0

    testValues.wsClientTemp1 = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collectionName}`
    )

    await new Promise((res) => testValues.wsClientTemp1.on('open', () => res()))

    expect(getCollectionsNames().length).toBe(numOfCollections + 1)
    expect(clientCollections[collectionName].length).toBe(numOfClients + 1)

    clientCollections[collectionName] = []
  })

  it('should not attach clients to with collections', async () => {
    testValues.wsClientTemp1 = new WebSocket(`ws://localhost:${PORT}`)
    await new Promise((res) => testValues.wsClientTemp1.on('open', () => res()))

    expect(clientCollections[collection1].length).toBe(0)
    expect(clientCollections[collection2].length).toBe(0)
  })

  it('should notify all clients that a collection was updated within 3 seconds', async () => {
    testValues.wsClientTemp1 = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collection1}`
    )
    testValues.wsClientTemp2 = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collection1}`
    )
    await new Promise((res) => testValues.wsClientTemp1.on('open', () => res()))
    await new Promise((res) => testValues.wsClientTemp2.on('open', () => res()))

    notifyClients(collection1, 'message received')

    let oneResolved = false
    const messages = { client1: null, client2: null }
    await expect(
      new Promise(async (resolve) => {
        const checkResolvePromise = () => {
          if (oneResolved) {
            resolve(messages)
          } else {
            oneResolved = true
          }
        }
        testValues.wsClientTemp1.onmessage = (event) => {
          messages.client1 = event.data
          checkResolvePromise()
        }
        testValues.wsClientTemp2.onmessage = (event) => {
          messages.client2 = event.data
          checkResolvePromise()
        }
        await new Promise((r) => setTimeout(r, 3000))
        resolve('no message received')
      })
    ).resolves.toEqual({
      client1: 'message received',
      client2: 'message received',
    })
  })

  it('should not notify incorrect collections', async () => {
    testValues.wsClientTemp1 = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collection1}`
    )
    await new Promise((res) => testValues.wsClientTemp1.on('open', () => res()))

    notifyClients('error_collection', 'message received')

    await expect(
      new Promise(async (resolve) => {
        testValues.wsClientTemp1.onmessage = (event) => {
          resolve(event.data)
        }
        await new Promise((r) => setTimeout(r, 50))
        resolve('no message received')
      })
    ).resolves.toBe('no message received')
  })

  it('should not notify closed clients', async () => {
    testValues.wsClientTemp1 = new WebSocket(
      `ws://localhost:${PORT}/?collection=${collection1}`
    )
    await new Promise((res) => testValues.wsClientTemp1.on('open', () => res()))

    testValues.wsClientTemp1.close()
    await new Promise((res) =>
      testValues.wsClientTemp1.on('close', () => res())
    )

    expect(testValues.wsClientTemp1.readyState).toBe(WebSocket.CLOSED)
    notifyClients(collection1, 'message received')

    await expect(
      new Promise(async (res) => {
        testValues.wsClientTemp1.onmessage = (event) => {
          res(event.data)
        }
        await new Promise((r) => setTimeout(r, 50))
        res('no message received')
      })
    ).resolves.toBe('no message received')
  })
  afterAll(async () => {
    if (testValues.wsServerGlobal) {
      testValues.wsServerGlobal.close()
      testValues.wsServerGlobal = null
    }
  })
})

afterAll(async () => {
  // Close servers if open
  if (testValues.httpServerGlobal) {
    testValues.httpServerGlobal.close()
    testValues.httpServerGlobal = null
  }
  if (testValues.wsServerGlobal) {
    testValues.wsServerGlobal.close()
    testValues.wsServerGlobal = null
  }
})
