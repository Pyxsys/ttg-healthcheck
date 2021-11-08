const request = require('supertest')
const Device = require('../models/device.js')
const app = require('../app')
const { setupLogTests, teardownLogTests } = require('./api_common.test')

const mockPayload = {
  deviceId: 'B3C2D-C033-7B87-4B31-244BFE931F1E',
  name: 'test device',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    { name: 'python', pid: 12345, status: 'running', cpu_percent: 1.768 },
    { name: 'celebid', pid: 12344, status: 'idle', cpu_percent: 0.462 },
  ],
}

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await Device.deleteMany()

  //add device
  await request(app).post('/api/daemon').send(mockPayload)
})

describe('Retrieve all devices', () => {
  it('should return all devices', async () => {
    const response = await request(app).get('/api/device/ids')
    expect(response.statusCode).toBe(200)
  })
})

describe('Retrieve a specific device given name or id', () => {
  it('Should retrieve specific device given name', async () => {
    const response = await request(app)
      .get('/api/device/?entry=test device')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
