const request = require('supertest')
const app = require('../app')
const wifi = require('../models/wifi.js')
const { setupLogTests, teardownLogTests, successTimestampLogTest, failureTimestampLogTest } = require('./api_common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await wifi.WifiLogs.deleteMany()
})

describe('Get Wifi Logs from DB between timestamps', () => {
  const wifiApi = '/api/wifi-logs/timestamp'

  it('should retrieve 0 Wifi between yesterday and tomorrow', async () => {
    await successTimestampLogTest(wifiApi, cookieSession)
  })

  it('should not retrieve any Wifi with 1 timestamp only)', async () => {
    await failureTimestampLogTest(wifiApi, cookieSession)
  })
})

describe('Get Wifi Logs from DB with specified attributes', () => {
  it('should retrieve 0 Wifi with the specified sendSpeed of 28.3', async () => {
    const query = {
      responseTime: 28.3,
    }

    const response = await request(app)
      .get('/api/wifi-logs')
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