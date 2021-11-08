const request = require('supertest')
const app = require('../app')
const Wifi = require('../models/wifi.js')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await Wifi.WifiLogs.deleteMany() //clear logs
})

describe('Check wifi Logs from DB with DeviceID', () => {
  it('Should save the contents of a post to the DB', async () => {
    const wifi =
      '/api/wifi-logs/specific-device?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&limit=2'
    const response = await request(app).get(wifi).set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('Should return error 500', async () => {
    const response = await request(app)
      .get('/api/wifi-logs/specific-device?limit=2')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(500)
  })
})

describe('Check Wifi Logs from DB with timestamps', () => {
  it('Should retrieve the contents of a post to the DB for a specific timestamp', async () => {
    const wifi =
      '/api/wifi-logs/timestamp?startTimeStamp=2021-10-24 09:45:55.966088+00:00&endTimeStamp=2021-10-24 09:49:55.966088+00:00'
    const response = await request(app).get(wifi).set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('Should not retrieve the contents of a post to the DB incorrect information (1 timestamp only)', async () => {
    const wifi =
      '/api/wifi-logs/timestamp?startTimeStamp=2021-10-24 09:45:55.966088+00:00'
    const response = await request(app).get(wifi).set('Cookie', cookieSession)
    expect(response.statusCode).toBe(500)
  })

  it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const wifi =
      '/api/wifi-logs/timestamp?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&startTimeStamp=2021-10-24 09:45:55.966088+00:00&endTimeStamp=2021-10-24 09:49:55.966088+00:00'
    const response = await request(app).get(wifi).set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

describe('Check Wifi Logs from DB with specific attributes', () => {
  it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const wifi =
      '/api/wifi-logs/specific-attribute?sendSpeed=0&receiveSpeed=0&signalStrength=bad'
    const response = await request(app).get(wifi).set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
