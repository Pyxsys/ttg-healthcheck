const app = require('./app')
const { monitorPredefinedCollections } = require('./db/change_streams')
const connectDB = require('./db/db_connection')
const { subscribeOnExit } = require('./destroyProcess')
const { attachWSConnection } = require('./websocket')

// start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
attachWSConnection(server)

// connect database
connectDB().then(() => {
  monitorPredefinedCollections()
})

// if process wants to exit
subscribeOnExit((err, code) => {
  console.error(err);
  server.close()
  process.exit(code)
})

