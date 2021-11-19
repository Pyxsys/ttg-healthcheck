const request = require('supertest')
const connectDB = require('../db/db_connection')
const app = require('../app')
const mongoose = require('mongoose')

const { filterData } = require('../api/shared/filter')

describe('Filter out attributes from Query', () => {
  it('should filter out the keyword limit and sort by -timestamp by default', () => {
    const req = {
      deviceId: '1',
      limit: '1',
    }
    const [query, options] = filterData(req)
    expect(query).toEqual({ deviceId: ['1'] })
    expect(options).toEqual({ limit: [1], sort: { timestamp: [-1] } })
  })

  it('should filter out the keyword orderBy and orderValue', () => {
    const req = {
      deviceId: '1',
      orderBy: 'timestamp',
      orderValue: '-1',
    }
    const [query, options] = filterData(req)
    expect(query).toEqual({ deviceId: ['1'] })
    expect(options).toEqual({ sort: { timestamp: [-1] } })
  })
})

const testUser = {
  name: 'api_common_test',
  password: process.env.PASSWORD,
  email: 'api_common_test@gmail.com',
  role: 'user',
}

const setupLogTests = async () => {
  let cookieSession

  await connectDB() // connect to local_db
  // register user
  await request(app).post('/api/user/register').send({
    name: testUser.name,
    password: testUser.password,
    email: testUser.email,
    role: testUser.role,
  })
  // login user and store cookie
  await request(app)
    .post('/api/user/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .then((res) => {
      cookieSession = res.headers['set-cookie'][0]
        .split(',')
        .map((item) => item.split(';')[0])
        .join(';')
    })

  return cookieSession
}

const teardownLogTests = async () => {
  await mongoose.connection.close()
}

module.exports = { setupLogTests, teardownLogTests }
