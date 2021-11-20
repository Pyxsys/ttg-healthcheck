const request = require('supertest')
const app = require('../app')
const disk = require('../models/disk.js')
const { setupLogTests, teardownLogTests, successTimestampLogTest, failureTimestampLogTest } = require('./api_common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await disk.DiskLogs.deleteMany()
})

describe('Get Disk Logs from DB between timestamps', () => {
  const diskApi = '/api/disk-logs/timestamp'

  it('should retrieve 0 Disks between yesterday and tomorrow', async () => {
    await successTimestampLogTest(diskApi, cookieSession)
  })

  it('should not retrieve any Disks with 1 timestamp only)', async () => {
    await failureTimestampLogTest(diskApi, cookieSession)
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
