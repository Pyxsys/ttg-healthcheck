const request = require('supertest')
const app = require('../app')
const wifi = require('../models/wifi.js')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await wifi.WifiLogs.deleteMany()
})

describe('Get Wifi Logs from DB between timestamps', () => {
  it('should retrieve 0 Wifi between yesterday and tomorrow', async () => {
    const d = new Date()
    const query = {
      startTimeStamp: d.setDate(d.getDate() - 1),
      endTimeStamp: d.setDate(d.getDate() + 1),
    }

    const response = await request(app)
      .get('/api/wifi-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(0)
  })

  it('should not retrieve any Wifi with 1 timestamp only)', async () => {
    const query = {
      startTimeStamp: new Date(),
    }

    const response = await request(app)
      .get('/api/wifi-logs/timestamp')
      .query(query)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(501)
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