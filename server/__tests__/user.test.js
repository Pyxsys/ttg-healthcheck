const request = require('supertest')
const connectDB = require('../db/db_connection')
const User = require('../models/user.js')
const app = require('../app')
const mongoose = require('mongoose')

let cookieSession = ''

const testUser = {
  name: 'test',
  password: 'password',
  email: 'test0@gmail.com',
  role: 'user',
}

const userOne = {
  name: 'test',
  password: 'password',
  email: 'test@gmail.com',
  role: 'user',
}

beforeAll(async () => {
  await connectDB() // connect to local_db
  await User.deleteMany()
  // register user
  await request(app).post('/api/user/register').send({
    name: testUser.name,
    password: testUser.password,
    email: testUser.email,
    role: testUser.role,
  })
  // login user and store cookie
  await request(app)
    .post('/api/user/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .then((res) => {
      cookieSession = res.headers['set-cookie'][0]
        .split(',')
        .map((item) => item.split(';')[0])
        .join(';')
    })
})

describe('Sign up given a username and password', () => {
  it('should respond with a 200 status code, Should specify json in the content type header & Should log in the user based on credentials ', async () => {
    await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
  })
})

describe('Test signup cases', () => {
  it('should respond with a 400 status code when user already exists', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response.statusCode).toBe(400)
  })
  it('should respond with a 500 status code when a param is missing', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response.statusCode).toBe(500)
  })
})

describe('Log in given a username and password', () => {
  it('Should respond with a 200 status code', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
  })
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
    expect(response.body.message).toBeDefined()
  })
  it('should respond with a 500 status code when a param is missing', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
    })
    expect(response.statusCode).toBe(500)
  })
  it('Should be able to access authenticated route', async () => {
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

describe('Log out', () => {
  it('Should respond with a 200 status code on successful logout', async () => {
    const response = await request(app)
      .get('/api/user/logout')
      .set('Cookie', cookieSession)
      .send({
        email: userOne.email,
        password: userOne.password,
      })
    expect(response.statusCode).toBe(200)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
