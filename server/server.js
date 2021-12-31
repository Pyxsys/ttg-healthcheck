const app = require('./app')
const connectDB = require('./db/db_connection')
const { subscribeOnExit } = require('./destroyProcess')
const { createWebSocketServer, listenForClients } = require('./ws_server')
const { closeMonitoredCollection } = require('./db/changeStreams')
const {
  connectClientsToRealTimeData,
  monitorRealTimeDataCollections,
} = require('./realTimeData/realTimeData')

// start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const wsServer = createWebSocketServer(server)
connectClientsToRealTimeData()
listenForClients(wsServer)

// connect database
connectDB().then(() => {
  monitorRealTimeDataCollections()
})

// if process wants to exit
subscribeOnExit((err, code) => {
  closeMonitoredCollection()
  server.close()
  console.error(err)
  process.exit(code)
})
