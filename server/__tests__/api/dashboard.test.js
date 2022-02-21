const request = require('supertest')

const app = require('../../app')
const { Dashboards } = require('../../models/dashboard')
const { setupLogTests, teardownLogTests } = require('./common.test')

const dashboardPayload = {
  userId: 'Test-User',
  widgets: [
    {
      widgetType: 'CPU',
      options: {deviceId: 'device-1', deviceName: 'device-name'}
    }
  ],
}
let cookieSession = ''

beforeAll(async () => {
  cookieSession = await setupLogTests()
  await Dashboards.deleteMany()
})

describe('Saving a dashboard', () => {
  beforeEach(async () => {
    await Dashboards.deleteMany()
  })

  it('should save a valid dashboard with widgets', async () => {
    const response = await request(app)
      .post('/api/dashboard')
      .send(dashboardPayload)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Save Successful')

    const results = await Dashboards.findOne({ userId: dashboardPayload.userId })
    expect(results).toBeDefined()
    expect(results.widgets.length).toBe(dashboardPayload.widgets.length)
  })

  it('should save a valid dashboard with no widgets', async () => {
    const noWidgets = {userId: dashboardPayload.userId, widgets: []}
    const response = await request(app)
      .post('/api/dashboard')
      .send(noWidgets)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Save Successful')

    const results = await Dashboards.findOne({ userId: noWidgets.userId })
    expect(results).toBeDefined()
    expect(results.widgets.length).toBe(0)
  })

  it('should not save an invalid dashboard with invalid User Id parameter', async () => {
    const invalidUserId = {widgets: []}
    const response = await request(app)
      .post('/api/dashboard')
      .send(invalidUserId)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Invalid: UserId must be a String')
  })

  it('should not save an invalid dashboard with invalid Widgets parameter', async () => {
    const invalidWidgets = {userId: dashboardPayload.userId}
    const response = await request(app)
      .post('/api/dashboard')
      .send(invalidWidgets)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Invalid: Widgets must be an Array')
  })

  it('should not save an invalid dashboard with an invalid Widget object', async () => {
    const invalidWidget = {userId: dashboardPayload.userId, widgets: [{widgetType: 'CPU'}]}
    const response = await request(app)
      .post('/api/dashboard')
      .send(invalidWidget)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Invalid: Widgets must have parameters: widgetType and options')
  })
})

describe('Get Dashboard from attributes', () => {
  beforeAll(async () => {
    await Dashboards.deleteMany()
    await request(app)
      .post('/api/dashboard')
      .send(dashboardPayload)
      .set('Cookie', cookieSession)
  })

  it('should retrieve 1 Dashboard given a correct User Id', async () => {
    const query = {
      userId: dashboardPayload.userId,
    }

    const response = await request(app)
      .get('/api/dashboard')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(1)
    expect(results[0].userId).toBe(dashboardPayload.userId)
  })

  it('should retrieve 0 Dashboards given an incorrect User Id', async () => {
    const query = {
      userId: 'Bad-User-Id',
    }

    const response = await request(app)
      .get('/api/dashboard')
      .query(query)
      .set('Cookie', cookieSession)

    const results = response.body.Results
    expect(response.statusCode).toBe(200)
    expect(results.length).toBe(1)
    expect(results[0]).toBeNull()
  })

  it('should return an error if no User Id is queried', async () => {
    const invalidQuery = {}

    const response = await request(app)
      .get('/api/dashboard')
      .query(invalidQuery)
      .set('Cookie', cookieSession)

    expect(response.statusCode).toBe(501)
    expect(response.text).toBe('Server Error: must include userId parameter')
  })
})

afterAll(async () => {
  await teardownLogTests()
})
