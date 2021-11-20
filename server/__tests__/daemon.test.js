const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const CPU = require('../models/cpu.js')
const Device = require('../models/device.js')
const mongoose = require('mongoose')
const api = require('../api/daemon')

beforeAll(async () => {
  await connectDB() // connect to local_db
  await CPU.CpuLogs.deleteMany() //clear logs
})

const mockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345, status: 'running', cpu_percent: 1.768 },
    { name: 'celebid', pid: 12344, status: 'idle', cpu_percent: 0.462 },
  ],
}

describe('Test helper functions', () => {

  it('Verify good deviceId is of correct format', () => {
    const result = api.verifyDeviceIdFormat(mockDevicePayload.deviceId)
    expect(result).toBe(true)
  })

  it('Verify bad deviceId throws error', () => {
    expect( () => { api.verifyDeviceIdFormat(null) })
    .toThrow('deviceId [' + null + '] is invalid')
  })
})
describe('Test CPU log formatter', () => {
  const doc = api.processCpuLogInfo(mockPayload)

  //computed values
  it('Sum of processes', () => {
    expect(doc.numProcesses).toBe(2)
  })

  it('Sum of CPU usage', () => {
    expect(doc.usagePercentage === 2.23).toBe(true)
  })

  it('Running processes', () => {
    expect(doc.threadsAlive === 1).toBe(true)
  })

  it('Sleeping processes', () => {
    expect(doc.threadsSleeping === 1).toBe(true)
  })

  //process values
  it('Process data is consistent', () => {
    expect(doc.processes[0].name).toBe(mockPayload.processes[0].name)
    expect(doc.processes[0].pid).toBe(mockPayload.processes[0].pid)
    expect(doc.processes[0].status).toBe(mockPayload.processes[0].status)
    expect(doc.processes[0].cpu_percent).toBe(
      mockPayload.processes[0].cpu_percent
    )
  })
})

describe('Save daemon payload to DB', () => {
  it('Should save the contents of a post to the DB', async () => {
    const response = await request(app).post('/api/daemon').send(mockPayload)

    expect(response.statusCode).toBe(200)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
