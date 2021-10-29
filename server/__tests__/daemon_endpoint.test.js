const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const CPU = require('../models/cpu.js')
const Device = require('../models/device.js')
const mongoose = require('mongoose')
const { response } = require('express')
const { CpuLogs } = require('../models/cpu.js')

beforeAll(async () => {
  await connectDB() // connect to local_db
  await CPU.CpuLogs.deleteMany() //clear logs
})

const mockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345 },
    { name: 'celebid', pid: 12344 },
  ],
}

describe('Save daemon payload to DB', () => {
  const conditionalCPULogTest = (bool) => (bool ? test : test.skip)

  test('Should save the contents of a post to the DB', async () => {
    const response = await request(app)
      .post('/api/daemon_endpoint')
      .send(mockPayload)

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
