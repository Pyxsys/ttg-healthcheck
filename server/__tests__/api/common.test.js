const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../../app')
const connectDB = require('../../db/db_connection')
const { parseQuery, getAttributes } = require('../../api/common/filter')

const SimpleMongoSchema = new mongoose.Schema({
  stringAttribute: String,
  numberAttribute: Number,
})

const EmbeddedMongoSchema = new mongoose.Schema({
  stringAttribute: String,
  embeddedAttribute: SimpleMongoSchema,
})

describe('Get the attributes of a Mongo Schema', () => {
  it('should return all first layer attributes', () => {
    const simpleAttributes = getAttributes(SimpleMongoSchema)
    const correctResult = ['stringAttribute', 'numberAttribute']
    expect(simpleAttributes).toMatchObject(correctResult)
  })

  it('should return all first layer attributes and embedded attributes', () => {
    const embeddedAttributes = getAttributes(EmbeddedMongoSchema)
    const correctResult = [
      'stringAttribute',
      'embeddedAttribute.stringAttribute',
      'embeddedAttribute.numberAttribute',
    ]
    expect(embeddedAttributes).toMatchObject(correctResult)
  })
})

describe('Filter out attributes from Query', () => {
  it('should filter out the keywords limit, skip and orderBy descending', () => {
    const req = {
      stringAttribute: 'string',
      limit: '1',
      skip: '1',
      orderBy: '-numberAttribute',
    }
    const [query, options] = parseQuery(req, SimpleMongoSchema)
    expect(query).toEqual({ stringAttribute: 'string' })
    expect(options).toEqual({
      limit: 1,
      skip: 1,
      sort: { numberAttribute: -1 },
    })
  })

  it('should filter out the keywords limit and orderBy ascending', () => {
    const req = {
      stringAttribute: 'string',
      orderBy: 'numberAttribute',
    }
    const [query, options] = parseQuery(req, SimpleMongoSchema)
    expect(query).toEqual({ stringAttribute: 'string' })
    expect(options).toEqual({ sort: { numberAttribute: 1 } })
  })

  it('should filter out the timestamp by default', () => {
    const req = {
      stringAttribute: 'string',
    }
    const [query, options] = parseQuery(req, SimpleMongoSchema)
    expect(query).toEqual({ stringAttribute: 'string' })
    expect(options).toEqual({ sort: { timestamp: -1 } })
  })

  it('should not include any attributes not included in the Schema', () => {
    const req = {
      stringAttribute: 'string',
      numberAttribute: 2,
      invalidAttribute: true,
    }
    const [query] = parseQuery(req, SimpleMongoSchema)
    expect(query).toEqual({ stringAttribute: 'string', numberAttribute: '2' })
  })

  it('should return embedded attributes with a period separating the paths', () => {
    const req = {
      stringAttribute: 'string',
      'embeddedAttribute.stringAttribute': 'stringTwo',
      'embeddedAttribute.numberAttribute': 2,
    }
    const [query] = parseQuery(req, EmbeddedMongoSchema)
    expect(query).toEqual({
      stringAttribute: 'string',
      'embeddedAttribute.stringAttribute': 'stringTwo',
      'embeddedAttribute.numberAttribute': '2',
    })
  })
})

/* -------------------------------
 * Common Variables and Functions
 * -------------------------------
 */

const mockStartupPayload = {
  deviceId: 'TEST3C2D-C033-7B87-4B31-244BFX931D14',
  name: 'test device',
  description: 'Device used for testing purposes. It is not real',
  connectionType: 'medium',
  status: 'active',
  provider: 'test_provider',
  memory_: {
    maxSize: 1024,
    formFactor: ['DIMM', 'DIMM'],
  },
  disk_: {
    capacity: 1000000000,
    physical_disk: [
      {
        media: 'SSD',
        model: 'TST  DISK10T2B0B-00TS70',
        size: 1000000000,
      },
    ],
  },
}

const mockLogPayload1 = {
  deviceId: 'TEST3C2D-C033-7B87-4B31-244BFX931D14',
  timestamp: '2021-10-24 09:47:55.966088',
  processes: [
    {
      name: 'python',
      pid: 12345,
      status: 'running',
      cpu_percent: 1.768,
      memory_percent: 2.65,
      rss: 25313280,
      vms: 10844561,
    },
    {
      name: 'celebid',
      pid: 12344,
      status: 'idle',
      cpu_percent: 0.462,
      memory_percent: 7.32,
      rss: 25319245,
      vms: 17502208,
    },
  ],
  memory: {
    available: 25166790656,
    free: 25166790656,
    used: 9103147008,
    percent: 26.6,
  },
  network: [38.4, 21.6],
  disk: {
    partitions: {
      'C:\\': {
        free: 317964967936,
        percent: 70.0,
        total: 1000000000,
        used: 681584918528,
      },
    },
    physical_disk_io: {
      PhysicalDrive0: {
        read_bytes: 8347789,
        read_count: 4109294,
        read_time: 238205985280,
        write_bytes: 3069,
        write_count: 267098048512,
        write_time: 4240,
      },
    },
  },
}

const mockLogPayload2 = {
  deviceId: 'TEST3C2D-C033-7B87-4B31-244BFX931D14',
  timestamp: '2021-11-24 09:47:55.966088',
  processes: [
    {
      name: 'python',
      pid: 12345,
      status: 'running',
      cpu_percent: 1.768,
      memory_percent: 2.65,
      rss: 25313280,
      vms: 10844561,
    },
    {
      name: 'celebid',
      pid: 12344,
      status: 'idle',
      cpu_percent: 0.462,
      memory_percent: 7.32,
      rss: 25319245,
      vms: 17502208,
    },
  ],
  memory: {
    available: 25166790656,
    free: 25166790656,
    used: 9103147008,
    percent: 26.6,
  },
  network: [38.4, 21.6],
  disk: {
    partitions: {
      'C:\\': {
        free: 317964967936,
        percent: 70.0,
        total: 1000000000,
        used: 681584918528,
      },
    },
    physical_disk_io: {
      PhysicalDrive0: {
        read_bytes: 8347789,
        read_count: 4109294,
        read_time: 238205985280,
        write_bytes: 3069,
        write_count: 267098048512,
        write_time: 4240,
      },
    },
  },
}

const testUser = {
  name: 'api_common_test',
  password: process.env.PASSWORD,
  email: 'api_common_test@gmail.com',
  role: 'user',
}

const setupLogTests = async () => {
  // connect to local_db
  await connectDB()

  // register user
  await request(app).post('/api/user/register').send({
    name: testUser.name,
    password: testUser.password,
    email: testUser.email,
    role: testUser.role,
  })

  // login user and store cookie
  const cookieSession = await request(app)
    .post('/api/user/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .then((res) =>
      res.headers['set-cookie'][0]
        .split(',')
        .map((item) => item.split(';')[0])
        .join(';')
    )

  return cookieSession
}

const teardownLogTests = async () => {
  await mongoose.connection.close()
}

module.exports = {
  setupLogTests,
  teardownLogTests,
  mockStartupPayload,
  mockLogPayload1,
  mockLogPayload2,
}
