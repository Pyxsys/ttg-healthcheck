const mongoose = require('mongoose')

/**
 * @typedef {{
 *  _id: {_data: string};
 *  operationType: string;
 *  clusterTime: Timestamp;
 *  fullDocument: any;
 *  ns: {db: string; coll: string};
 *  documentKey: any
 * }} ChangeStreamDocument
 */

/**
 * Callback for insertion into the database.
 * @callback ChangeStreamCallback
 * @param {ChangeStreamDocument} change the change from the database
 */

let monitoredChangeStreams = []

const pipeline = {
  $match: {
    operationType: 'insert',
  },
}

/**
 * Creates a change stream for a given collection. If the collection does
 * not exist it will be created implicitly. If the change stream already
 * exists, then the existing one is returned.
 * @param {String} collectionName
 * @returns a change stream
 */
const createChangeStream = (collectionName) => {
  const existingChangeStream = monitoredChangeStreams.find(
    (stream) => stream.parent.collectionName === collectionName
  )
  if (existingChangeStream) {
    return existingChangeStream
  }

  const client = mongoose.connection.getClient()
  const db = client.db(process.env.MONGO_DB)
  const collection = db.collection(collectionName)
  const changeStream = collection.watch([pipeline])
  monitoredChangeStreams.push(changeStream)
  return changeStream
}

/**
 * Calls the provided function when the change stream receives an update.
 * @param {ChangeStream<Document>} changeStream
 * @param {ChangeStreamCallback} callbackFn A function that accepts one arguments: **change**
 */
const onChangeStreamChange = (changeStream, callbackFn) => {
  changeStream.on('change', (next) => {
    callbackFn(next)
  })
}

/**
 * Monitor a collection to notify clients when
 * the collection receives an update.
 * @param {String} collectionName
 * @param {ChangeStreamCallback} callbackFn A function that accepts one arguments: **change**
 */
const monitorCollection = (collectionName, callbackFn) => {
  const changeStream = createChangeStream(collectionName)
  onChangeStreamChange(changeStream, callbackFn)
}

/**
 * Close the selected monitored collections. If collectionName
 * is null then close all the open monitor collections.
 * @param {String} collectionName
 */
const closeMonitoredCollection = (collectionName) => {
  monitoredChangeStreams = monitoredChangeStreams.filter((changeStream) => {
    const monitoredCollection = changeStream.parent.collectionName
    if (!collectionName || monitoredCollection === collectionName) {
      changeStream.close()
      return false
    }
    return true
  })
}

const numOfMonitoredChangeStream = () => {
  return monitoredChangeStreams.length
}

module.exports = {
  monitorCollection,
  closeMonitoredCollection,

  test: {
    createChangeStream,
    onChangeStreamChange,
    numOfMonitoredChangeStream,
  },
}
