const { Server } = require('ws')
const { attatchClient, detatchClient } = require('./db/collection_subject')

/**
 * Create a web socket server over an http server
 * @param {Server} server http server
 * @returns the web socket server
 */
const createWebSocketServer = (server) => {
  // Create Web Socket Server on top of the HTTP server (using the same port)
  const wsServer = new Server({
    server: server,
    // Do not need Client Tracking, since it is done manually
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
 * When a client connects to the web socket server, subscribe
 * them to the collection for updates.
 * @param {Server} wsServer web socket server
 */
const listeningForClients = (wsServer) => {
  wsServer.on('connection', (client, a) => {
    // Get the collections the client wishes to subscribe to
    const path = getQueryStringParams('collection', a.url)
    if (path) {
      // Attach the client to the collection subjects
      const collections = path.split(',')
      collections.forEach((collection) => {
        attatchClient(client, collection)
      })
    }

    // Remove client from clientList after ws closes
    client.on('close', () => {
      detatchClient(client)
    })
  })
}

const getQueryStringParams = (params, url) => {
  const regEx = new RegExp('[?&]' + params + '=([^&#]*)')
  const value = regEx.exec(decodeURIComponent(url))
  return value ? value[1] : null
}

module.exports = { createWebSocketServer, listeningForClients }
