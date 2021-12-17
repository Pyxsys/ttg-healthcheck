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
    expect(response.text).toEqual('{"message":"No token"}')
  })
  it('should respond with a 401 message of Invalid token when not passing a valid token', async () => {
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', 'access_token=eyJhbGciOiJIUzI1')
    expect(response.statusCode).toBe(401)
    expect(response.text).toEqual('{"message":"Invalid token"}')
  })
})

afterAll(async () => {
  await teardownLogTests()
})
