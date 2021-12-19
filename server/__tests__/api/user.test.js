const request = require('supertest')

const app = require('../../app')
const User = require('../../models/user.js')
const { setupLogTests, teardownLogTests } = require('./common.test')

let cookieSession = ''

const userOne = {
  name: 'test',
  password: process.env.PASSWORD,
  email: 'test@gmail.com',
  role: 'user',
}

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await User.deleteMany()
})

describe('Sign up given a username and password', () => {
  it('should respond with a 200 status code, Should specify json in the content type header & Should log in the user based on credentials ', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response.statusCode).toBe(200)
  })
})

describe('Test signup cases', () => {
  it('should respond with a 400 status code when user already exists', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response.statusCode).toBe(400)
  })

  it('should respond with a 500 status code when a param is missing', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: userOne.name,
      email: userOne.email,
      role: userOne.role,
    })
    expect(response.statusCode).toBe(500)
  })
})

describe('Log in given a username and password', () => {
  it('Should respond with a 200 status code', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
    expect(response.statusCode).toBe(200)
  })

  it('Should respond with a 400 status code when email does not exists', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'a324@test.com',
      password: userOne.password,
    })
    expect(response.statusCode).toBe(400)
  })

  it('Should respond with a 400 status code when password is wrong', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: userOne.email,
        password: process.env.PASSWORD + 'a',
      })
    expect(response.statusCode).toBe(400)
  })

  it('Should specify json in the content type header', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
  })

  it('Should log in the user based on credentials', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
      password: userOne.password,
    })
    expect(response.body.message).toBeDefined()
  })

  it('should respond with a 500 status code when a param is missing', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: userOne.email,
    })
    expect(response.statusCode).toBe(500)
  })
})

describe('Log out', () => {
  it('Should respond with a 200 status code on successful logout', async () => {
    const response = await request(app)
      .get('/api/user/logout')
      .set('Cookie', cookieSession)
      .send({
        email: userOne.email,
        password: userOne.password,
      })
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
