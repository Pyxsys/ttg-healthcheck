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

describe('Sign up given a username and password', () => {
  it('should respond with a 200 status code, Should specify json in the content type header & Should log in the user based on credentials ', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    expect(response.body.user.id).toBeDefined()
  })
  it('should respond with a 400 status code when user already exists', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    const response1 = await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response1.statusCode).toBe(400)
  })
})

describe('Log in given a username and password', () => {
  it('Should respond with a 400 status code when email does not exists', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'a324@test.com',
      password: userOne.password,
    })
    expect(response.statusCode).toBe(400)
  })
  it('Should respond with a 400 status code when password is wrong', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: 'a',
    })
    expect(response.statusCode).toBe(400)
  })
  it('Should respond with a 200 status code', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
    expect(response.statusCode).toBe(200)
  })
  it('Should specify json in the content type header', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
  })
  it('Should log in the user based on credentials', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
    expect(response.body.user.id).toBeDefined()
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
