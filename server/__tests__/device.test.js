const request = require('supertest')
const Device = require('../models/device.js')
const app = require('../app')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

const deviceMockPayload1 = {
  deviceId: '01234-5678-9ABC-DEF0',
  name: 'test device',
  description: 'Device used for testing purposes. It is not real',
  connectionType: 'medium',
  status: 'active',
  provider: 'test_provider',
}

const deviceMockPayload2 = {
  deviceId: '0FEDC-BA98-7654-3210',
  name: 'second device',
  description: 'Another device used for testing purposes. It is still not real',
  connectionType: 'string',
  status: 'active',
  provider: 'test_provider',
}

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await Device.deleteMany()

  //add device
  await request(app).post('/api/daemon/device').send(deviceMockPayload1)
  await request(app).post('/api/daemon/device').send(deviceMockPayload2)
})

describe('Get Device Ids', () => {
  it('should retreive all devices in the database', async () => {
    const response = await request(app)
      .get('/api/device/ids')
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(2)
    expect(results).toEqual(expect.arrayContaining([deviceMockPayload1.deviceId, deviceMockPayload2.deviceId]))
  })
})

describe('Retrieve a specific device given name or id', () => {
  it('Should retrieve specific device given name', async () => {
    const response = await request(app)
      .get('/api/device?entry=test device')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
