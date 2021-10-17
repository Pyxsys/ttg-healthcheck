const { Server } = require('ws')
const clientCollections = require('./db/ws_clients')

// connect to database
const attachWSConnection = (server) => {
  // Create Web Socket Server on top of the HTTP server (using the same port)
  const wsServer = new Server({
    server: server,
    // Do not need Client Tracking, since it is done manually
    clientTracking: false,
  })

  wsServer.on('connection', (client, a) => {
    // Add client to client list under the subscribed collection
    const path = getQueryStringParams('collection', a.url)
    if (path) {
      const collections = path.split(',')
      collections.forEach((collection) => {
        clientCollections[collection]?.push(client)
      })
    }

    // Remove client from clientList after ws closes
    client.on('close', () => {
      Object.keys(clientCollections).forEach((collection) => {
        clientCollections[collection] = clientCollections[collection].filter(
          (collectionClient) => collectionClient !== client
        )
      })
    })
  })
}

const getQueryStringParams = (params, url) => {
  const regEx = new RegExp('[?&]' + params + '=([^&#]*)')
  const value = regEx.exec(decodeURIComponent(url))
  return value ? value[1] : null
}

module.exports = { attachWSConnection }
