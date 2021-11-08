const request = require('supertest')
const app = require('../app')
const disk = require('../models/disk.js')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await disk.DiskLogs.deleteMany() //clear logs
})

describe('Check disk Logs from DB with DeviceID', () => {
  it('Should save the contents of a post to the DB', async () => {
    const disk = '/api/disk-logs/specific-device?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&limit=2'
    const response = await request(app)
      .get(disk)
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('Should return error 500', async () => {
    const disk = '/api/disk-logs/specific-device?limit=2'
    const response = await request(app)
      .get(disk)
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(500)
  })
})

describe('Check disk Logs from DB with timestamps', () => {
  it('Should retrieve the contents of a post to the DB for a specific timestamp', async () => {
    const disk = '/api/disk-logs/timestamp?startTimeStamp=2021-10-24 09:45:55.966088+00:00&endTimeStamp=2021-10-24 09:49:55.966088+00:00'
    const response = await request(app)
      .get(disk)
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('Should not retrieve the contents of a post to the DB incorrect information (1 timestamp only)', async () => {
    const disk = '/api/disk-logs/timestamp?startTimeStamp=2021-10-24 09:45:55.966088+00:00'
    const response = await request(app)
      .get(disk)
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(500)
  })

  it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const disk =  '/api/disk-logs/timestamp?deviceId=B3C2D-C033-7B87-4B31-244BFE931F1E&startTimeStamp=2021-10-24 09:45:55.966088+00:00&endTimeStamp=2021-10-24 09:49:55.966088+00:00'
    const response = await request(app)
      .get(disk)
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

describe('Check disk Logs from DB with specific attributes', () => {
  it('Should retrieve the contents of a post to the DB for a specific timestamp and a deviceID', async () => {
    const disk = '/api/disk-logs/specific-attribute?usagePercentage=0&usageSpeed=0&numProcesses=0&threadsAlive=1&threadsSleeping=0&uptime=0'
    const response = await request(app)
      .get(disk)
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
