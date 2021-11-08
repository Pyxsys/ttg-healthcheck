const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const mongoose = require('mongoose')

const testUser = {
  name: 'test',
  password: process.env.PASSWORD,
  email: 'test2@gmail.com',
  role: 'user',
}

let cookieSession = ''

beforeAll(async () => {
  await connectDB() // connect to local_db
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

describe('Authentication test', () => {
  it('Should be able to access authenticated route and respond with a 200 status code', async () => {
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
  it('should respond with a 401 message of no token when not passing a cookie', async () => {
    const response = await request(app).get('/api/user/authenticate')
    expect(response.statusCode).toBe(401)
    expect(response.text).toEqual('{"message":"No token"}')
  })
  it('should respond with a 401 message of Invalid token when not passing a valid token', async () => {
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', 'access_token=eyJhbGciOiJIUzI1')
    expect(response.statusCode).toBe(401)
    expect(response.text).toEqual('{"message":"Invalid token"}')
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
