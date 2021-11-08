const request = require('supertest')
const connectDB = require('../db/db_connection')
const Device = require('../models/device.js')
const app = require('../app')
const mongoose = require('mongoose')

const mockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  name: 'test device',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345, status: 'running', cpu_percent: 1.768 },
    { name: 'celebid', pid: 12344, status: 'idle', cpu_percent: 0.462 },
  ],
}

const testUser = {
  name: 'test',
  password: process.env.PASSWORD,
  email: 'test1@gmail.com',
  role: 'user',
}

let cookieSession = ''

beforeAll(async () => {
  await connectDB() // connect to local_db
  await Device.deleteMany()

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

  //add device
  await request(app).post('/api/daemon').send(mockPayload)
})

describe('Retrieve all devices', () => {
  it('should return all devices', async () => {
    const response = await request(app).get('/api/device/ids')
    expect(response.statusCode).toBe(200)
  })
})

describe('Retrieve a specific device given name or id', () => {
  it('Should retrieve specific device given name', async () => {
    const response = await request(app)
      .get('/api/device/?entry=test device')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
