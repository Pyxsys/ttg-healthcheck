const app = require('./app')
const { monitorPredefinedCollections } = require('./db/change_streams')
const connectDB = require('./db/db_connection')
const { subscribeOnExit } = require('./destroyProcess')
const {
  listeningForClients,
  createWebSocketServer,
} = require('./ws_server')

// start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const wsServer = createWebSocketServer(server)
listeningForClients(wsServer)

// connect database
connectDB().then(() => {
  monitorPredefinedCollections()
})

// if process wants to exit
subscribeOnExit((err, code) => {
  console.error(err)
  server.close()
  process.exit(code)
})
