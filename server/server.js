const app = require('./app')
const { attachWSConnection } = require('./websocket')

// start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
attachWSConnection(server)
