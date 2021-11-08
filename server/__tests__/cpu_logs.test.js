const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const CPU = require('../models/cpu.js')
const Device = require('../models/device.js')
const mongoose = require('mongoose')
const { response } = require('express')
const { CpuLogs } = require('../models/cpu.js')

const testUser = {
  name: 'test',
  password: process.env.PASSWORD,
  email: 'test1@gmail.com',
  role: 'user',
}

let cookieSession = ''


const mockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345 },
    { name: 'celebid', pid: 12344 },
  ],
}


beforeAll(async () => {
  await connectDB() // connect to local_db
  await CPU.CpuLogs.deleteMany() //clear logs
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

describe('Check CPU Logs from DB with DeviceID', () => {
  const conditionalCPULogTest = (bool) => (bool ? test : test.skip)

  it('Should save the contents of a post to the DB', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/specific-device?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&limit=2'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('Should save the contents of a post to the DB', async () => {
    const response = await request(app)
      .get('/api/cpu-logs/specific-device?limit=2')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(500)
  })
})

describe('Check CPU Logs from DB with timestamps', () => {
  const conditionalCPULogTest = (bool) => (bool ? test : test.skip)

  it('Should retrieve the contents of a post to the DB for a specific timestamp', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/timestamp?startTimeStamp=2021-10-24 09:45:55.966088+00:00&endTimeStamp=2021-10-24 09:49:55.966088+00:00'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('Should not retrieve the contents of a post to the DB incorrect information (1 timestamp only)', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/timestamp?startTimeStamp=2021-10-24 09:45:55.966088+00:00'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(500)
  })

  it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/timestamp?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&startTimeStamp=2021-10-24 09:45:55.966088+00:00&endTimeStamp=2021-10-24 09:49:55.966088+00:00'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

describe('Check CPU Logs from DB with specific attributes', () => {
  const conditionalCPULogTest = (bool) => (bool ? test : test.skip)

  it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/specific-attribute?usagePercentage=0&usageSpeed=0&numProcesses=0&threadsAlive=1&threadsSleeping=0&uptime=0'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
  //TODO Make the request result in 404
  /*it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/specific-attribute/'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(404)
  })*/
})


afterAll( async () => {
  // Closing the DB connection allows Jest to exit successfully.
  await mongoose.connection.close()
})