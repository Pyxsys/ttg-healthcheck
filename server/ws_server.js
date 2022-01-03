const { Server, WebSocket } = require('ws')

/**
 * Callback for client connections.
 * @callback ClientConnectionCallback
 * @param {WebSocket} client the client that connected
 * @param {IncomingMessage} additionalInfo additional information that passed with the client
 */

/**
 * Collection of callback functions for client connection.
 * @type {ClientConnectionCallback[]}
 */
const clientConnectionFns = []

/**
 * Create a web socket server over an http server
 * @param {Server} server http server
 * @returns the web socket server
 */
const createWebSocketServer = (server) => {
  // Create Web Socket Server on top of the HTTP server (using the same port)
  // Do not need Client Tracking, since it is done manually
  const wsServer = new Server({
    server: server,
    clientTracking: false,
  })

  // Close Web Socket server when http server closes
  server.on('close', () => {
    wsServer.close()
  })

  return wsServer
}

/**
 * Listens on a web socket server for a client to connect.
 *
 * When a client connects to the web socket server, connects the
 * client to the appropriate functionality.
 * @param {Server} wsServer web socket server
 */
const listenForClients = (wsServer) => {
  wsServer.on('connection', (client, additionalInfo) => {
    notifyClientConnectionFns(client, additionalInfo)
  })
}

/**
 * Calls the provided function when the client connects to the
 * websocket server.
 * @param {ClientConnectionCallback} callbackFn A function that accepts two arguments: **client**, **additionalInfo**
 */
const onClientConnection = (callbackFn) => {
  clientConnectionFns.push(callbackFn)
}

/**
 * Clears the callback functions that are called on a client connection.
 */
const clearClientConnectionFns = () => {
  clientConnectionFns.splice(0)
}

/**
 *
 * @param {WebSocket} client
 * @param {IncomingMessage} additionalInfo
 */
const notifyClientConnectionFns = (client, additionalInfo) => {
  clientConnectionFns.forEach((callbackFn) =>
    callbackFn(client, additionalInfo)
  )
}

module.exports = {
  createWebSocketServer,
  listenForClients,
  onClientConnection,

  test: {
    clientConnectionFns,
    clearClientConnectionFns,
    notifyClientConnectionFns,
  },
}
