const clientCollections = {
  cpu_logs: [],
  memory_logs: [],
}

/**
 * Returns the names of the collection.
 *
 * Includes collections that clients have connected
 * to as well as predefined collections.
 * @returns array of names of the collections
 */
const getCollectionsNames = () => {
  return Object.keys(clientCollections)
}

/**
 * Attach a client observable to the collection subject.
 * @param {WebSocket} client
 * @param {string} collection
 */
const attatchClient = (client, collection) => {
  if (!clientCollections[collection]) {
    clientCollections[collection] = []
  }
  clientCollections[collection].push(client)
}

/**
 * Detach a client observable from all the collection subjects.
 * @param {WebSocket} client
 */
const detatchClient = (client) => {
  Object.keys(clientCollections).forEach((collection) => {
    clientCollections[collection] = clientCollections[collection].filter(
      (collectionClient) => collectionClient !== client
    )
  })
}

/**
 * Notify all clients observable for a given collection subject.
 * @param {string} collection
 * @param {string} data data to pass to clients
 */
const notifyClients = (collection, data) => {
  if (getCollectionsNames().includes(collection)) {
    clientCollections[collection].forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data)
      }
    })
  }
}

module.exports = {
  clientCollections,
  attatchClient,
  detatchClient,
  notifyClients,
  getCollectionsNames,
}
