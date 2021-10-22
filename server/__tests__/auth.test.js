const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

jest.mock('jwt')
verify.mockReturnValue({
  //...
})

const token = '6162f6420ca50c64dda2f5a4'

describe('Test webtoken', () => {
  it('should respond with a 200 status code', async () => {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    console.log(data)
    expect(response.body.user.id).toBeDefined()
  })
})
