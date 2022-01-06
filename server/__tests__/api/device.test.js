const request = require('supertest')

const app = require('../../app')
const { Devices } = require('../../models/device')
const {
  setupLogTests,
  teardownLogTests,
  mockStartupPayload,
} = require('./common.test')

const device1 = {
  ...mockStartupPayload,
  deviceId: 'TEST1C2D-C033-7B87-4B31-244BFX931D14',
  name: 'firstDevice',
}

const device2 = {
  ...mockStartupPayload,
  deviceId: 'TEST2C2D-C033-7B87-4B31-244BFX931D14',
  name: 'secondDevice',
}

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await Devices.deleteMany()

  //add device
  await request(app).post('/api/daemon/device').send(device1)
  await request(app).post('/api/daemon/device').send(device2)
})

describe('Get Device Ids', () => {
  it('should retreive all devices in the database', async () => {
    const response = await request(app)
      .get('/api/device/ids')
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
    expect(results).toEqual(
      expect.arrayContaining([device1.deviceId, device2.deviceId])
    )
  })

  it('should retreive the total number of devices in the database', async () => {
    const response = await request(app)
      .get('/api/device/ids')
      .query({ Total: true })
      .set('Cookie', cookieSession)

    const total = response.body.Total
    expect(response.statusCode).toBe(200)
    expect(total).toBe(2)
  })
})

describe('Retrieve a specific device given name or id', () => {
  it('Should retrieve specific device given name', async () => {
    const response = await request(app)
      .get('/api/device')
      .query({ deviceId: device1.deviceId })
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
    const results = response.body.Results
    expect(results.length).toBe(1)
    expect(results[0].deviceId).toEqual(device1.deviceId)
  })

  it('should retreive the total number of devices in the database with a limit', async () => {
    const response = await request(app)
      .get('/api/device')
      .query({ Total: true, limit: 1 })
      .set('Cookie', cookieSession)

    const total = response.body.Total
    expect(response.statusCode).toBe(200)
    expect(total).toBe(2)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
