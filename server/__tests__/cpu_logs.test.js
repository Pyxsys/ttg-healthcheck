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
})

const mockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345 },
    { name: 'celebid', pid: 12344 },
  ],
}

describe('Check CPU Logs from DB', () => {
  const conditionalCPULogTest = (bool) => (bool ? test : test.skip)

  it('Should save the contents of a post to the DB', async () => {
    const response = await request(app)
      .get(
        '/api/cpu-logs/specific-device?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&limit=2'
      )
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  conditionalCPULogTest(response.statusCode === 200)(
    'Retreive saved CPU Log',
    () => {
      CpuLogs.find({
        deviceId: mockPayload.deviceId,
        timestamp: mockPayload.timestamp,
      }).then(function (doc) {
        expect(doc.numProcesses).toBe(2)
        expect(doc.processes[0].name).toBe(mockPayload.processes[0].name)
        expect(doc.processes[0].pid).toBe(mockPayload.processes[0].pid)
      })
    }
  )
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})

/*
  describe('Check CPU Logs from DB', () => {
    const conditionalCPULogTest = (bool) => (bool ? test : test.skip)
  
    test('Should save the contents of a post to the DB', async () => {
      const response = await request(app)
        .get('/api/cpuLogs/timestamp?name=python&pid=12345')
  
      expect(response.statusCode).toBe(200)
    })
  
    conditionalCPULogTest(response.statusCode === 200)(
      'Retreive saved CPU Log',
      () => {
        CpuLogs.find({
          deviceId: mockPayload.deviceId,
          timestamp: mockPayload.timestamp,
        }).then(function (doc) {
          expect(doc.numProcesses).toBe(2)
          expect(doc.processes[0].name).toBe(mockPayload.processes[0].name)
          expect(doc.processes[0].pid).toBe(mockPayload.processes[0].pid)
        })
      }
    )
  })

  describe('Check CPU Logs from DB', () => {
    const conditionalCPULogTest = (bool) => (bool ? test : test.skip)
  
    test('Should save the contents of a post to the DB', async () => {
      const response = await request(app)
        .get('/api/cpuLogs/specific-attribute?name=python&pid=12345')
  
      expect(response.statusCode).toBe(200)
    })
  
    conditionalCPULogTest(response.statusCode === 200)(
      'Retreive saved CPU Log',
      () => {
        CpuLogs.find({
          deviceId: mockPayload.deviceId,
          timestamp: mockPayload.timestamp,
        }).then(function (doc) {
          expect(doc.numProcesses).toBe(2)
          expect(doc.processes[0].name).toBe(mockPayload.processes[0].name)
          expect(doc.processes[0].pid).toBe(mockPayload.processes[0].pid)
        })
      }
    )
  })
  */
