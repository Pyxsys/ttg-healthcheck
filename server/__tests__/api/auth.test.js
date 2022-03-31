const request = require('supertest')

const app = require('../../app')
const { setupLogTests, teardownLogTests } = require('./common.test')

let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
})

describe('Authentication test', () => {
  it('Should be able to access authenticated route and respond with a 200 status code', async () => {
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', cookieSession)
    expect(response.statusCode).toBe(200)
  })

  it('should respond with a 401 message of no token when not passing a cookie', async () => {
    const response = await request(app).get('/api/user/authenticate')
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('No token')
  })

  it('should respond with a 401 message of Invalid token when not passing a valid token', async () => {
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', 'access_token=some_invalid_token')
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toEqual('Invalid token')
  })
})

afterAll(async () => {
  await teardownLogTests()
})
