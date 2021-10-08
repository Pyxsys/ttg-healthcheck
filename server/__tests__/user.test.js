const request = require('supertest')
const connectDB = require('../db/db_connection')
const User = require('../models/user.js')
const app = require('../app')
const mongoose = require('mongoose')

beforeAll(async () => {
  await connectDB() // connect to local_db
  await User.deleteMany()
})

const userOne = {
  name: 'test',
  password: 'password',
  email: 'test@gmail.com',
  role: 'none',
}

describe('Create a new user', () => {
  it('should create a new user in the local database', async () => {
    const response = await request(app).post('/api/user').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    console.log(response.body)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
