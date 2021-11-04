
const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const mongoose = require('mongoose')

beforeAll(async () => {
  await connectDB() // connect to local_db
})

describe('Aknowledge daemon', () => {
  it('Should send a 200 response when post is received', async () => {
    const response = await request(app).post('/api/daemon_endpoint').send({})
    console.log(response.body)
    expect(response.statusCode).toBe(200)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})

