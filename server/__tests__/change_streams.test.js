const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const connectDB = require('../db/db_connection')
const User = require('../models/user')
const {
  closeMonitoredCollection,
  monitorCollection,
} = require('../db/changeStreams')
const { createChangeStream, numOfMonitoredChangeStream } =
  require('../db/changeStreams').test

const collection1 = 'new_collection_1'
const collection2 = 'new_collection_2'

const changeSteamUser = {
  name: 'change-stream',
  password: process.env.PASSWORD,
  email: 'change-stream@gmail.com',
  role: 'user',
}

beforeAll(async () => {
  // connect to local_db
  await connectDB()
  await User.deleteMany()
})

describe('Monitoring change streams', () => {
  beforeEach(async () => {
    closeMonitoredCollection()
  })

  it('should create a change stream', () => {
    const newChangeStream = createChangeStream(collection1)
    expect(newChangeStream).toBeDefined()
    expect(newChangeStream.parent.collectionName).toBe(collection1)
    expect(numOfMonitoredChangeStream()).toBe(1)
  })

  it('should return the same change stream', () => {
    const firstChangeStream = createChangeStream(collection1)
    const secondChangeStream = createChangeStream(collection1)
    expect(firstChangeStream).toEqual(secondChangeStream)
    expect(numOfMonitoredChangeStream()).toBe(1)
  })

  it('should close one collection change stream', async () => {
    createChangeStream(collection1)
    createChangeStream(collection2)
    const initChangeStreams = numOfMonitoredChangeStream()
    closeMonitoredCollection(collection1)
    const removeAChangeStreams = numOfMonitoredChangeStream()
    expect(removeAChangeStreams).toBe(initChangeStreams - 1)
  })

  it('should close all the collection change streams', async () => {
    createChangeStream(collection1)
    const initChangeStreams = numOfMonitoredChangeStream()
    expect(initChangeStreams).not.toBe(0)
    closeMonitoredCollection()
    const removeMultipleChangeStreams = numOfMonitoredChangeStream()
    expect(removeMultipleChangeStreams).toBe(0)
  })
})

describe('Insert a new user to the database and get data from the change stream', () => {
  beforeAll(async () => {
    closeMonitoredCollection()
  })

  it('should receive the inserted data from the websocket', async () => {
    expect.assertions(4)

    monitorCollection(User.collection.collectionName, (change) => {
      const document = change.fullDocument
      expect(document).toBeDefined()
      expect(document && document.constructor === Object).toBeTruthy()
      expect(document.email).toBe(changeSteamUser.email)
    })

    const response = await request(app).post('/api/user/register').send({
      name: changeSteamUser.name,
      password: changeSteamUser.password,
      email: changeSteamUser.email,
      role: changeSteamUser.role,
    })
    expect(response.statusCode).toBe(200)

    await new Promise((res) => {
      setTimeout(() => res(), 500)
    })
  })

  afterAll(() => {
    closeMonitoredCollection()
  })
})

afterAll(async () => {
  // Closing the DB connection allows Jest to exit successfully.
  closeMonitoredCollection()
  await mongoose.connection.close()
})
