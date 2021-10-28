const mongoose = require('mongoose')
const clientCollections = require('./ws_clients')

var changeStreamsMonitored = []
const pipeline = {
  $match: {
    $or: [{ operationType: 'insert' }, { operationType: 'update' }],
    // operationType: 'update'
  },
}

/**
 * Creates a change stream for a given collection.
 * If the collection does not exist it will be created
 * implicitly. Returns the created change stream.
 * @param {String} collectionName
 * @returns a change stream
 */
const createChangeStream = async (collectionName) => {
  const client = mongoose.connection.getClient()
  const db = client.db(process.env.MONGO_DB)
  const collection = db.collection(collectionName)
  return collection.watch([pipeline])
}

/**
 * Attach a change stream to notify the clients
 * when the change stream recieves a change.
 * @param {ChangeStream<Document>} changeStream
 */
const attachNotifyClients = async (changeStream) => {
  // When there is a change to the collection
  changeStream.on('change', (next) => {
    clientCollections[changeStream.parent.collectionName].forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(next))
      }
    })
  })
}

/**
 * Monitor a collection to notify clients when
 * the collection receives an update.
 * @param {String} collectionName
 */
const monitorCollection = async (collectionName) => {
  const changeStream = await createChangeStream(collectionName)
  changeStreamsMonitored.push(changeStream)
  attachNotifyClients(changeStream)
}

/**
 * Monitor all the predefined collections to notify
 * clients when the collection receives an update.
 */
const monitorPredefinedCollections = async () => {
  Object.keys(clientCollections).forEach(async (dbCollection) => {
    await monitorCollection(dbCollection)
  })
}

/**
 * Close the selected monitored collections. If collectionName
 * is null then close all the open monitor collections.
 * @param {String} collectionName
 */
const closeMonitoredCollection = async (collectionName) => {
  changeStreamsMonitored = changeStreamsMonitored.filter((changeStream) => {
    if (
      !collectionName ||
      changeStream.parent.collectionName === collectionName
    ) {
      changeStream.close()
      return false
    }
    return true
  })
}

module.exports = {
  createChangeStream,
  attachNotifyClients,
  monitorCollection,
  monitorPredefinedCollections,
  closeMonitoredCollection,
}
