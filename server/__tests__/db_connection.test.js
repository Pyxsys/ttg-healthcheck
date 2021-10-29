const connectDB = require('../db/db_connection')
const mongoose = require('mongoose')
const { subscribeOnExit, unsubscribeAll } = require('../destroyProcess')

const initDbURL = process.env.MONGODB_URL

describe('Connect to the MongoDB with an incorrect URL', () => {
  it('should try to exit the server with code 1', (done) => {
    subscribeOnExit((err, code) => {
      expect(code).toBe(1)
      unsubscribeAll()
      done()
    })

    const dbURL = process.env.MONGODB_URL
    process.env.MONGODB_URL = 'undefined'
    connectDB().finally(() => {
      mongoose.connection.close()
      process.env.MONGODB_URL = dbURL
    })
  })
})

describe('Connect to the MongoDB with a correct URL', () => {
  it('should properly connect to the Mongo database', async () => {
    const dbURL = process.env.MONGODB_URL
    expect(dbURL).toBe('mongodb://localhost:27017/test')

    await expect(connectDB()).resolves.toBeUndefined()
    mongoose.connection.close()
  })
})

afterAll(() => {
  unsubscribeAll()
  process.env.MONGODB_URL = initDbURL
})
