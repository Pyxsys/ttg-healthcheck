const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const mongoose = require('mongoose')
const Device = require('../models/device.js')
const CPU = require('../models/cpu.js')
const daemonFunctions = require('../api/daemon')

const deviceMockPayload = {
  deviceId: '01234-5678-9ABC-DEF0',
  name: 'test device',
  description: 'Device used for testing purposes. It is not real',
  connectionType: 'medium',
  status: 'active',
  provider: 'test_provider',
}

const cpuMockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345, status: 'running', cpu_percent: 1.768 },
    { name: 'celebid', pid: 12344, status: 'idle', cpu_percent: 0.462 },
  ],
}

beforeAll(async () => {
  // Connect to local DB
  await connectDB()

  // Clear DB
  await CPU.CpuLogs.deleteMany()
  await Device.deleteMany()
})

describe('Test CPU log formatter', () => {
  const doc = daemonFunctions.processCpuLogInfo(cpuMockPayload)

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
    expect(doc.processes[0].name).toBe(cpuMockPayload.processes[0].name)
    expect(doc.processes[0].pid).toBe(cpuMockPayload.processes[0].pid)
    expect(doc.processes[0].status).toBe(cpuMockPayload.processes[0].status)
    expect(doc.processes[0].cpu_percent).toBe(
      cpuMockPayload.processes[0].cpu_percent
    )
  })
})

describe('Save daemon device to DB', () => {
  it('should insert the device to the DB', async () => {
    const response = await request(app)
      .post('/api/daemon/device')
      .send(deviceMockPayload)

    expect(response.statusCode).toBe(200)
    const devices = await Device.find()
    expect(devices.length).toBe(1)
    expect(devices[0].name).toBe('test device')
  })
  
  it('should update the device in the DB', async () => {
    const response = await request(app)
      .post('/api/daemon/device')
      .send({...deviceMockPayload, name: 'another name'})

    expect(response.statusCode).toBe(200)
    const devices = await Device.find()
    expect(devices.length).toBe(1)
    expect(devices[0].name).toBe('another name')
  })
})

describe('Save daemon payload to DB', () => {
  it('Should save the contents of a post to the DB', async () => {
    const response = await request(app).post('/api/daemon').send(cpuMockPayload)

    expect(response.statusCode).toBe(200)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
