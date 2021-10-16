const mongoose = require('mongoose')
const clientCollections = require('./ws_clients')

const pipeline = {
  $match: {
    $or: [{ operationType: 'insert' }, { operationType: 'update' }],
    // operationType: 'update'
  },
}

const monitorChangeStream = async (collectionName) => {
  const client = mongoose.connection.getClient()
  const db = client.db('database')
  const collection = db.collection(collectionName)
  const changeStream = collection.watch([pipeline])

  // When there is a change to the collection
  changeStream.on('change', (next) => {
    clientCollections[collectionName].forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(next))
      }
    })
  })

  // When the process exits, close the change stream
  process.on('exit', () => {
    changeStream.close()
    console.log(
      `Closed MongoDB Change Stream for collection: ${collectionName}`
    )
  })
}

const monitorAllChangeStreams = async () => {
  Object.keys(clientCollections).forEach((dbCollection) => {
    monitorChangeStream(dbCollection)
  })
}

module.exports = { monitorChangeStream, monitorAllChangeStreams }
