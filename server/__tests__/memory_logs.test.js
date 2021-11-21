const request = require('supertest')
const app = require('../app')
const memory = require('../models/memory.js')
const {
  setupLogTests,
  teardownLogTests,
  failureTimestampLogTest,
  successTimestampLogTest,
} = require('./api_common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await memory.MemoryLogs.deleteMany()
})

describe('Get Memory Logs from DB between timestamps', () => {
  const memoryApi = '/api/memory-logs/timestamp'

  it('should retrieve 0 Memory between yesterday and tomorrow', async () => {
    await successTimestampLogTest(memoryApi, cookieSession)
  })

  it('should not retrieve any Memory with 1 timestamp only)', async () => {
    await failureTimestampLogTest(memoryApi, cookieSession)
  })
})

describe('Get Memory Logs from DB with specified attributes', () => {
  it('should retrieve 0 Memory with the specified usagePercentage of 68.89', async () => {
    const query = {
      responseTime: 68.89,
    }

    const response = await request(app)
      .get('/api/memory-logs')
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
