const { filterData } = require('../api/shared/filter')

describe('Filter out attributes from Query', () => {
  it('should filter out the keyword limit', () => {
    const req = {
      deviceId: '1',
      limit: '1',
    }
    const [query, options] = filterData(req)
    expect(query).toEqual({ deviceId: ['1'] })
    expect(options).toEqual({ limit: [1] })
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
