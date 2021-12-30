const WebSocket = require('ws')

const app = require('../app')
const {
  createWebSocketServer,
  listenForClients,
  onClientConnection,
} = require('../ws_server')
const {
  clientConnectionFns,
  clearClientConnectionFns,
  notifyClientConnectionFns,
} = require('../ws_server').test

const PORT = 8081
const PORT_TEMP = 8091

let httpServerGlobal = null

beforeAll((done) => {
  httpServerGlobal = app.listen(PORT, () => done())
})

describe('Create Web Socket server', () => {
  it('should successfully create a Web Socket server', async () => {
    const wsServer = createWebSocketServer(httpServerGlobal)
    expect(wsServer).toBeDefined()
    wsServer.close()
  })
})

describe('Disconnect HTTP server', () => {
  it('should disconnect Web Socket server as well', async () => {
    const httpServerTemp = await new Promise((resolve) => {
      const s = app.listen(PORT_TEMP, () => resolve(s))
    })
    const wsServerTemp = createWebSocketServer(httpServerTemp)

    expect(httpServerTemp).not.toBeNull()
    expect(wsServerTemp).not.toBeNull()

    await expect(
      new Promise((resolve) => {
        wsServerTemp.on('close', () => {
          resolve('closed')
        })
        httpServerTemp.close()
      })
    ).resolves.toBe('closed')
  })
})

describe('Update the collection of client connections', () => {
  beforeEach(() => {
    clearClientConnectionFns()
  })

  it('should add a function to the list of client connections', async () => {
    onClientConnection(() => 'added')
    const addedClientConnections = clientConnectionFns.length
    expect(addedClientConnections).toBe(1)
  })

  it('should clear all functions in the list of client connections', async () => {
    onClientConnection(() => 'added 1')
    onClientConnection(() => 'added 2')
    const numClientConnectionsBefore = clientConnectionFns.length
    expect(numClientConnectionsBefore).toBe(2)

    clearClientConnectionFns()
    const removedClientConnections = clientConnectionFns.length
    expect(removedClientConnections).toBe(0)
  })

  it('should call a function after notifying', async () => {
    const clientSocket = 'Client'
    const additionalInfo = 'Additional Information'
    onClientConnection((client, info) => {
      expect(client).toBe(clientSocket)
      expect(info).toBe(additionalInfo)
    })

    notifyClientConnectionFns(clientSocket, additionalInfo)
  })
})

describe('Listen to client Web Sockets that connect to the Web Socket server', () => {
  let wsServer = null
  let wsClient = null

  beforeAll(() => {
    wsServer = createWebSocketServer(httpServerGlobal)
    clearClientConnectionFns()
  })

  it('should call a function after the client connects to the websocket server', async () => {
    const url = `/?additional-information`
    listenForClients(wsServer)
    onClientConnection((client, info) => {
      expect(client).toBeInstanceOf(WebSocket)
      expect(info.url).toBe(url)
    })

    wsClient = new WebSocket(`ws://localhost:${PORT}${url}`)
    await new Promise((res) => wsClient.on('open', () => res()))
    expect.assertions(2)
  })

  afterAll(async () => {
    if (wsClient) {
      wsClient.close()
      await new Promise((res) => wsClient.on('close', () => res()))
      wsClient = null
    }
    if (wsServer) {
      wsServer.close()
      await new Promise((res) => wsServer.on('close', () => res()))
      wsServer = null
    }
  })
})

afterAll(async () => {
  // Close servers if open
  if (httpServerGlobal) {
    httpServerGlobal.close()
    httpServerGlobal = null
  }
})
