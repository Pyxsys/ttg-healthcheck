const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const mongoose = require('mongoose')
const Device = require('../models/device.js')
const { CpuLogs } = require('../models/cpu.js')
const daemonFunctions = require('../api/daemon')

const mockStartupPayload = {
  deviceId: 'TEST3C2D-C033-7B87-4B31-244BFX931D14',
  name: 'test device',
  description: 'Device used for testing purposes. It is not real',
  connectionType: 'medium',
  status: 'active',
  provider: 'test_provider',
  memory_: {
    maxSize: 1024,
    formFactor: ['DIMM', 'DIMM'],
  },
}

const mockLogPayload = {
  deviceId: 'TEST3C2D-C033-7B87-4B31-244BFX931D14',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345, status: 'running', cpu_percent: 1.768 },
    { name: 'celebid', pid: 12344, status: 'idle', cpu_percent: 0.462 },
  ],
}

beforeAll(async () => {
  await connectDB() // connect to local_db
  await Device.deleteMany() //clear devices
  await CpuLogs.deleteMany() //clear logs
})

describe('Test helper functions', () => {
  it('Verify good deviceId is of correct format', () => {
    const result = daemonFunctions.verifyDeviceIdFormat(
      mockStartupPayload.deviceId
    )
    expect(result).toBe(true)
  })

  it('Verify bad deviceId throws error', () => {
    expect(() => daemonFunctions.verifyDeviceIdFormat(null)).toThrow(
      'deviceId [' + null + '] is invalid'
    )
  })
})

describe('Test Device formatters', () => {
  const doc = daemonFunctions.processDeviceInfo(mockStartupPayload)

  //process values
  it('Process data is consistent', () => {
    expect(doc.deviceId).toBe(mockStartupPayload.deviceId)
    expect(doc.memory.maxSize).toBe(mockStartupPayload.memory_.maxSize)
    expect(doc.memory.formFactor[0]).toBe(
      mockStartupPayload.memory_.formFactor[0]
    )
  })
})

describe('Test CPU log formatter', () => {
  const doc = daemonFunctions.processCpuLogInfo(mockLogPayload)
  //computed values
  it('Sum of processes', () => {
    expect(doc.numProcesses).toBe(2)
  })

  it('Sum of CPU usage', () => {
    expect(doc.usagePercentage).toBe(2.23)
  })

  it('Running processes', () => {
    expect(doc.threadsAlive).toBe(1)
  })

  it('Sleeping processes', () => {
    expect(doc.threadsSleeping).toBe(1)
  })

  //process values
  it('Process data is consistent', () => {
    expect(doc.processes[0].name).toBe(mockLogPayload.processes[0].name)
    expect(doc.processes[0].pid).toBe(mockLogPayload.processes[0].pid)
    expect(doc.processes[0].status).toBe(mockLogPayload.processes[0].status)
    expect(doc.processes[0].cpu_percent).toBe(
      mockLogPayload.processes[0].cpu_percent
    )
  })
})

describe('Save daemon device to DB', () => {
  const devicePath = '/api/daemon/device'

  it('should insert the device to the DB', async () => {
    const response = await request(app).post(devicePath).send(mockStartupPayload)
    expect(response.statusCode).toBe(200)

    const devices = await Device.find()
    expect(devices.length).toBe(1)
    expect(devices[0].name).toBe('test device')
  })

  it('should update the device in the DB', async () => {
    const updatedDevice = { ...mockStartupPayload, name: 'another name' }
    const response = await request(app).post(devicePath).send(updatedDevice)
    expect(response.statusCode).toBe(200)

    const devices = await Device.find()
    expect(devices.length).toBe(1)
    expect(devices[0].name).toBe('another name')
  })

  it('should not insert a device with incorrect deviceId to the DB', async () => {
    const invalidDevice = { ...mockStartupPayload, deviceId: 'invalid' }
    const response = await request(app).post(devicePath).send(invalidDevice)
    expect(response.statusCode).toBe(501)

    const devices = await Device.find()
    expect(devices.length).toBe(1)
  })
})

describe('Save daemon payload to DB', () => {
  const logPath = '/api/daemon'
  it('Should save the CPU log to the DB', async () => {
    const response = await request(app).post(logPath).send(mockLogPayload)
    expect(response.statusCode).toBe(200)

    const cpus = await CpuLogs.find()
    expect(cpus.length).toBe(1)
  })

  it('Should not insert the CPU Log with incorrect deviceId to the DB', async () => {
    const invalidCPU = { ...mockLogPayload, deviceId: 'invalid' }
    const response = await request(app).post(logPath).send(invalidCPU)
    expect(response.statusCode).toBe(501)

    const cpus = await CpuLogs.find()
    expect(cpus.length).toBe(1)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
