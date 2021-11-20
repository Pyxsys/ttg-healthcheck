const request = require('supertest')
const app = require('../app')
const CPU = require('../models/cpu.js')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

let cookieSession = ''

const cpuMockPayload1 = {
  deviceId: '01234-5678-9ABC-DEF0',
  timestamp: new Date(),
  processes: [
    { name: 'python', pid: 12345, cpu_percent: 12.14 },
    { name: 'celebid', pid: 12344, cpu_percent: 23.66 },
    { name: 'System Idle Process', pid: 12343, cpu_percent: 64.2 },
  ],
}
const cpuMockPayload2 = {
  deviceId: '0FEDC-BA98-7654-3210',
  timestamp: new Date(),
  processes: [
    { name: 'python', pid: 12345, cpu_percent: 23.75 },
    { name: 'celebid', pid: 12344, cpu_percent: 34.29 },
    { name: 'System Idle Process', pid: 12343, cpu_percent: 41.96 },
  ],
}
const cpuMockPayload3 = {
  deviceId: '0FEDC-BA98-7654-3210',
  timestamp: new Date('06-06-2020T12:00:00'),
  processes: [
    { name: 'python', pid: 12345, cpu_percent: 10.96 },
    { name: 'celebid', pid: 12344, cpu_percent: 6.86 },
    { name: 'System Idle Process', pid: 12343, cpu_percent: 82.19 },
  ],
}

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await CPU.CpuLogs.deleteMany()

  //add devices
  await request(app).post('/api/daemon').send(cpuMockPayload1)
  await request(app).post('/api/daemon').send(cpuMockPayload2)
  await request(app).post('/api/daemon').send(cpuMockPayload3)
})

describe('Get CPU Logs from DB between timestamps', () => {
  it('should retrieve 2 CPUs between yesterday and tomorrow with the total usage percentage being 93.84', async () => {
    const d = new Date()
    const query = {
      startTimeStamp: d.setDate(d.getDate() - 1),
      endTimeStamp: d.setDate(d.getDate() + 1),
    }

    const response = await request(app)
      .get('/api/cpu-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
    expect(results[0].usagePercentage + results[1].usagePercentage).toBe(93.84)
  })

  it('should retrieve no CPUs between 1990 and 1991', async () => {
    const query = {
      startTimeStamp: new Date('01-01-1990'),
      endTimeStamp: new Date('01-01-1991'),
    }

    const response = await request(app)
      .get('/api/cpu-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(200)
    expect(response.body.Results.length).toBe(0)
  })

  it('Should retrieve the specified CPU from deviceId between today and yesterday with the usage percentage being 35.8', async () => {
    const d = new Date()
    const query = {
      deviceId: cpuMockPayload1.deviceId,
      startTimeStamp: d.setDate(d.getDate() - 1),
      endTimeStamp: d.setDate(d.getDate() + 1),
    }

    const response = await request(app)
      .get('/api/cpu-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(1)
    expect(results[0].usagePercentage).toBe(35.8)
  })

  it('should not retrieve any CPUs with 1 timestamp only)', async () => {
    const query = {
      startTimeStamp: new Date(),
    }

    const response = await request(app)
      .get('/api/cpu-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(501)
  })
})

describe('Get CPU Logs from DB with specified attributes', () => {
  it('should retrieve 2 CPUs with a specified deviceId', async () => {
    const query = {
      deviceId: cpuMockPayload2.deviceId,
    }

    const response = await request(app)
      .get('/api/cpu-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
  })

  it('should retrieve 1 CPU with the specified usagePercentage of 17.82', async () => {
    const query = {
      usagePercentage: 17.82,
    }

    const response = await request(app)
      .get('/api/cpu-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(1)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
