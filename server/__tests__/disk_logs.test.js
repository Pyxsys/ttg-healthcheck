const request = require('supertest')
const app = require('../app')
const disk = require('../models/disk.js')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await disk.DiskLogs.deleteMany()
})

describe('Get Disk Logs from DB between timestamps', () => {
  it('should retrieve 0 Disks between yesterday and tomorrow', async () => {
    const d = new Date()
    const query = {
      startTimeStamp: d.setDate(d.getDate() - 1),
      endTimeStamp: d.setDate(d.getDate() + 1),
    }

    const response = await request(app)
      .get('/api/disk-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(0)
  })

  it('should not retrieve any Disks with 1 timestamp only)', async () => {
    const query = {
      startTimeStamp: new Date(),
    }

    const response = await request(app)
      .get('/api/disk-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(501)
  })
})

describe('Get Disk Logs from DB with specified attributes', () => {
  it('should retrieve 0 Disks with the specified responseTime of 565', async () => {
    const query = {
      responseTime: 565,
    }

    const response = await request(app)
      .get('/api/disk-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(0)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
