const request = require('supertest')

const app = require('../../app')
const { DeviceLogs } = require('../../models/device_logs')
const {
  setupLogTests,
  teardownLogTests,
  mockLogPayload1,
  mockLogPayload2,
} = require('./common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await DeviceLogs.deleteMany()

  //add devices
  await request(app).post('/api/daemon').send(mockLogPayload1)
  await request(app).post('/api/daemon').send(mockLogPayload2)
})

describe('Get Device Logs using timestamps', () => {
  it('should retrieve 2 Devices greater than the first date', async () => {
    const date1 = new Date(mockLogPayload1.timestamp)
    const query = {
      timestamp_gte: date1,
    }

    const response = await request(app)
      .get('/api/device-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
  })

  it('should retrieve 2 Devices less than the second date', async () => {
    const date2 = new Date(mockLogPayload2.timestamp)
    const query = {
      timestamp_lte: date2,
    }

    const response = await request(app)
      .get('/api/device-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
  })

  it('should retrieve 1 Device between the first date and the next day', async () => {
    const date1 = new Date(mockLogPayload1.timestamp)
    const nextDay = new Date(mockLogPayload1.timestamp)
    nextDay.setDate(nextDay.getDate() + 1)

    const query = {
      timestamp_gte: date1,
      timestamp_lte: nextDay,
    }

    const response = await request(app)
      .get('/api/device-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(1)
  })
})

describe('Get Device Logs from attributes', () => {
  it('should retrieve 1 Device given the device Id', async () => {
    const payloadDeviceId = mockLogPayload1.deviceId
    const query = {
      deviceId: payloadDeviceId,
    }

    const response = await request(app)
      .get('/api/device-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
    expect(results[0].deviceId).toBe(payloadDeviceId)
    expect(results[1].deviceId).toBe(payloadDeviceId)
  })

  it('should retreive the total number of DeviceLogs in the database with a limit', async () => {
    const payloadDeviceId = mockLogPayload1.deviceId
    const query = {
      deviceId: payloadDeviceId,
      Total: true,
      limit: 1,
    }

    const response = await request(app)
      .get('/api/device-logs')
      .query(query)
      .set('Cookie', cookieSession)

    const total = response.body.Total
    expect(response.statusCode).toBe(200)
    expect(total).toBe(2)
  })
})

describe('Get the latest logs from the devices', () => {
  it('should retrieve 1 Device with the timestamp from the second date', async () => {
    const payloadDeviceId = mockLogPayload1.deviceId
    const secondDate = mockLogPayload2.timestamp
    const query = {
      Ids: [payloadDeviceId],
    }

    const response = await request(app)
      .get('/api/device-logs/latest')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(1)
    expect(results[0].timestamp).toBeTruthy()
    expect(new Date(results[0].timestamp).toString()).toBe(
      new Date(secondDate).toString()
    )
  })

  it('should retrieve an empty array if no Ids are found', async () => {
    const query = {
      Ids: ['InvalidID-Found'],
    }

    const response = await request(app)
      .get('/api/device-logs/latest')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(0)
  })

  it('should retrieve an empty array if no Ids are passed', async () => {
    const query = {
      Ids: [''],
    }

    const response = await request(app)
      .get('/api/device-logs/latest')
      .query(query)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(200)
    expect(response.body.Results.length).toBe(0)
  })

  it('should throw an error if no "Ids" attribute is passed in the query', async () => {
    const query = {
      invalid: true,
    }

    const response = await request(app)
      .get('/api/device-logs/latest')
      .query(query)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(501)
    expect(response.text).toBe('Server Error: must include Ids parameter')
  })
})

afterAll(async () => {
  await teardownLogTests()
})
