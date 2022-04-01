const request = require('supertest')

const app = require('../../app')
const User = require('../../models/user.js')
const { setupLogTests, teardownLogTests } = require('./common.test')

const newUser = {
  name: 'New User',
  password: process.env.PASSWORD,
  email: 'new_user@gmail.com',
}

const userOne = {
  name: 'Test',
  password: process.env.PASSWORD,
  email: 'test@gmail.com',
}

const userTwo = {
  name: 'Test2',
  password: process.env.PASSWORD,
  email: 'test2@gmail.com',
}

const adminOne = {
  name: 'Admin',
  password: process.env.PASSWORD,
  email: 'test_admin@gmail.com',
}

const adminTwo = {
  name: 'Admin2',
  password: process.env.PASSWORD,
  email: 'test_admin2@gmail.com',
}

/**
 * Login into with a specific user.
 * @param {'admin' | 'user' | 'disabled'} type
 * @returns cookie access token
 */
const login = async (type) => {
  let user
  switch (type) {
    case 'admin':
      user = adminOne
      break
    case 'user':
      user = userOne
      break
    case 'disabled':
      user = newUser
      break
  }
  return request(app)
    .post('/api/user/login')
    .send({
      email: user.email,
      password: user.password,
    })
    .then((res) =>
      res.headers['set-cookie'][0]
        .split(',')
        .map((item) => item.split(';')[0])
        .join(';')
    )
}

beforeAll(async () => {
  // connect to local_db
  await setupLogTests()
  await User.deleteMany()
  await request(app).post('/api/user/register').send(userOne)
  await request(app).post('/api/user/register').send(userTwo)
  await request(app).post('/api/user/register').send(adminOne)
  await request(app).post('/api/user/register').send(adminTwo)
  await User.updateMany(
    { $or: [{ email: userOne.email }, { email: userTwo.email }] },
    { role: 'user' }
  )
  await User.updateMany(
    { $or: [{ email: adminOne.email }, { email: adminTwo.email }] },
    { role: 'admin' }
  )
})

describe('Sign up given a username and password', () => {
  it('should respond with a 200 status code, Should specify json in the content type header & Should log in the user based on credentials ', async () => {
    const response = await request(app).post('/api/user/register').send(newUser)
    expect(response.statusCode).toBe(200)
    const registered_user = await User.find({ email: newUser.email })
    expect(registered_user.length).toBe(1)
  })
})

describe('Test signup cases', () => {
  it('should respond with a 400 status code when user already exists', async () => {
    const response = await request(app).post('/api/user/register').send(newUser)
    expect(response.statusCode).toBe(400)
    const already_registered = await User.find({ email: newUser.email })
    expect(already_registered.length).toBe(1)
  })

  it('should respond with a 500 status code when a param is missing', async () => {
    const response = await request(app).post('/api/user/register').send({
      name: newUser.name,
      email: newUser.email,
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
    const cookieSession = await login('user')
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

describe('Authenticate user', () => {
  it('should authenticate the logged in user', async () => {
    const userCookie = await login('user')
    const response = await request(app)
      .get('/api/user/authenticate')
      .set('Cookie', userCookie)
    expect(response.statusCode).toBe(200)
    expect(response.body.isAuthenticated).toBe(true)
  })
})

describe('Get all users', () => {
  it('should return a list of 4 users, when requested by an admin', async () => {
    const adminCookieAll = await login('admin')
    const response = await request(app)
      .get('/api/user/all')
      .set('Cookie', adminCookieAll)
    expect(response.statusCode).toBe(200)
    expect(response.body.Results.length).toBe(5)
  })

  it('should return an error, when requested by a user', async () => {
    const userCookieAll = await login('user')
    const response = await request(app)
      .get('/api/user/all')
      .set('Cookie', userCookieAll)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })
})

describe('Get user profile', () => {
  it("should not get a user's profile if no user id is provided", async () => {
    const noUserCookie = await login('admin')
    const response = await request(app)
      .get('/api/user/profile')
      .set('Cookie', noUserCookie)
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Bad request, no userId provided')
  })

  it("should not get a user's profile if a disabled user is accessing it", async () => {
    const disabledCookieProfile = await login('disabled')
    const response = await request(app)
      .get('/api/user/profile')
      .set('Cookie', disabledCookieProfile)
      .query({ userId: 'some_id' })
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it("should not get a user's profile if a user accesses another profile", async () => {
    const userAccessInvalidCookie = await login('user')
    const userOther = await User.findOne({ email: userTwo.email })
    const response = await request(app)
      .get('/api/user/profile')
      .set('Cookie', userAccessInvalidCookie)
      .query({ userId: String(userOther._id) })
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it("should get a user's profile if a user access their own profile", async () => {
    const userAccessSameCookie = await login('user')
    const usersame = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .get('/api/user/profile')
      .set('Cookie', userAccessSameCookie)
      .query({ userId: String(usersame._id) })
    expect(response.statusCode).toBe(200)
    expect(response.body.Total).toBe(1)
  })

  it("should get a valid user's profile if an admin is accessing it", async () => {
    const adminCookieProfile = await login('admin')
    const user = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .get('/api/user/profile')
      .set('Cookie', adminCookieProfile)
      .query({ userId: String(user._id) })
    expect(response.statusCode).toBe(200)
    expect(response.body.Results).toBeTruthy()
    expect(response.body.Total).toBe(1)
  })

  it("should not get a invalid user's profile if an admin is accessing it", async () => {
    const adminCookieProfileBad = await login('admin')
    const response = await request(app)
      .get('/api/user/profile')
      .set('Cookie', adminCookieProfileBad)
      .query({ userId: 'some_invalid_id' })
    expect(response.statusCode).toBe(400)
    expect(response.body.Results).toEqual(expect.arrayContaining([]))
  })
})

describe('Edit user info', () => {
  it('should not edit a user if a disabled user is accessing it', async () => {
    const disabledCookieEdit = await login('disabled')
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', disabledCookieEdit)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it('should not edit a user if a user accesses another profile', async () => {
    const userEditInvalidCookie = await login('user')
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', userEditInvalidCookie)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it('should throw error if invalid userId', async () => {
    const adminMissingNameCookie = await login('admin')
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', adminMissingNameCookie)
      .send({
        formData: {
          _id: { _id: 'invalidId' },
          name: 'admin',
          email: 'someEmail@email.com',
        },
      })
    expect(response.statusCode).toBe(500)
  })

  it('should not edit a user if missing name', async () => {
    const adminMissingNameCookie = await login('admin')
    const adminMissingName = await User.findOne({ email: adminOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', adminMissingNameCookie)
      .send({
        formData: {
          _id: String(adminMissingName._id),
          email: 'someEmail@email.com',
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Name cannot be empty')
  })

  it('should not edit a user if missing name', async () => {
    const adminMissingEmailCookie = await login('admin')
    const adminMissingEmail = await User.findOne({ email: adminOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', adminMissingEmailCookie)
      .send({
        formData: {
          _id: String(adminMissingEmail._id),
          name: 'some name',
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Email cannot be empty')
  })

  it('should not edit a user if email already exists', async () => {
    const adminEmailExistsCookie = await login('admin')
    const adminEmailExists = await User.findOne({ email: adminOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', adminEmailExistsCookie)
      .send({
        formData: {
          _id: String(adminEmailExists._id),
          email: adminTwo.email,
          name: adminEmailExists.name,
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Email already exists')
  })

  it('should not edit a user if admin is the last one', async () => {
    const adminLastOneCookie = await login('admin')
    await User.updateOne(
      {
        email: adminTwo.email,
      },
      {
        role: 'user',
      }
    )
    const lastAdmin = await User.findOne({ email: adminOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', adminLastOneCookie)
      .send({
        formData: {
          _id: String(lastAdmin._id),
          email: lastAdmin.email,
          name: lastAdmin.name,
          role: 'user',
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe(
      'Cannot change role, a minimum of 1 admin role is required'
    )

    await User.updateOne(
      {
        email: adminTwo.email,
      },
      {
        role: 'admin',
      }
    )
  })

  it('should edit a user if an admin is editing', async () => {
    const adminChangeCookie = await login('admin')
    const adminChange = await User.findOne({ email: adminOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', adminChangeCookie)
      .send({ formData: adminChange })
    expect(response.statusCode).toBe(200)
  })

  it('should allow the user to edit themselves', async () => {
    const userChangeCookie = await login('user')
    const userChange = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfileInfo')
      .set('Cookie', userChangeCookie)
      .send({ formData: userChange })
    expect(response.statusCode).toBe(200)
  })
})

describe('Change user password', () => {
  it('should not change password if a disabled user is accessing it', async () => {
    const disabledCookiePassword = await login('disabled')
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', disabledCookiePassword)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it('should not change password if a user accesses another profile', async () => {
    const userPasswordInvalidCookie = await login('user')
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', userPasswordInvalidCookie)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it('should not change password if passwords do not match', async () => {
    const adminWrongPasswordCookie = await login('admin')
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', adminWrongPasswordCookie)
      .send({
        formData: {
          newPassword: 'passOne',
          newPassword1: 'passTwo',
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('New password and confirm password do not match')
  })

  it('should not change password if passwords do not match', async () => {
    const adminEmptyPasswordCookie = await login('admin')
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', adminEmptyPasswordCookie)
      .send({
        formData: {
          newPassword: '',
          newPassword1: '',
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Password cannot be empty')
  })

  it('should throw error if invalid userId', async () => {
    const adminEmptyPasswordCookie = await login('admin')
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', adminEmptyPasswordCookie)
      .send({
        formData: {
          _id: { _id: 'invalidId' },
          newPassword: 'test',
          newPassword1: 'test',
        },
      })
    expect(response.statusCode).toBe(500)
  })

  it('should not change password if user enters wrong old password', async () => {
    const userWrongPasswordCookie = await login('user')
    const userWrongPassword = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', userWrongPasswordCookie)
      .send({
        formData: {
          _id: String(userWrongPassword._id),
          oldPassword: 'invalidPass',
          newPassword: userOne.password,
          newPassword1: userOne.password,
        },
      })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Old password is incorrect')
  })

  it('should change password if user enters correct old password', async () => {
    const userCorrectPasswordCookie = await login('user')
    const userCorrectPassword = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', userCorrectPasswordCookie)
      .send({
        formData: {
          _id: String(userCorrectPassword._id),
          oldPassword: userOne.password,
          newPassword: userOne.password,
          newPassword1: userOne.password,
        },
      })
    expect(response.statusCode).toBe(200)
  })

  it('should change password if admin accesses user', async () => {
    const adminPasswordCookie = await login('admin')
    const adminPassword = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .post('/api/user/editUserProfilePassword')
      .set('Cookie', adminPasswordCookie)
      .send({
        formData: {
          _id: String(adminPassword._id),
          oldPassword: userOne.password,
          newPassword: userOne.password,
          newPassword1: userOne.password,
        },
      })
    expect(response.statusCode).toBe(200)
  })
})

describe('user logout', () => {
  it("should not get a user's log if a disabled user is accessing it", async () => {
    const disabledCookieProfile = await login('disabled')
    const response = await request(app)
      .get('/api/user/log')
      .set('Cookie', disabledCookieProfile)
      .query({ userId: 'some_id' })
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it("should get a valid user's log if an admin is accessing it", async () => {
    const adminCookieProfile = await login('admin')
    const user = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .get('/api/user/log')
      .set('Cookie', adminCookieProfile)
      .query({ userId: String(user._id) })
    expect(response.statusCode).toBe(200)
    expect(response.body.Results).toBeTruthy()
  })

  it("should not get a user's log if a user accesses another log", async () => {
    const userAccessInvalidCookie = await login('user')
    const userOther = await User.findOne({ email: userTwo.email })
    const response = await request(app)
      .get('/api/user/log')
      .set('Cookie', userAccessInvalidCookie)
      .query({ userId: String(userOther._id) })
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it("should not get a invalid user's log if an admin is accessing it", async () => {
    const adminCookieProfileBad = await login('admin')
    const response = await request(app)
      .get('/api/user/log')
      .set('Cookie', adminCookieProfileBad)
      .query({ userId: 'some_invalid_id' })
    expect(response.statusCode).toBe(400)
    expect(response.body.Results).toEqual(expect.arrayContaining([]))
  })

  it("should get a user's log if a user access their own log", async () => {
    const userAccessSameCookie = await login('user')
    const usersame = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .get('/api/user/log')
      .set('Cookie', userAccessSameCookie)
      .query({ userId: String(usersame._id) })
    expect(response.statusCode).toBe(200)
  })

  it("should not get a user's log if no user id is provided", async () => {
    const noUserCookie = await login('admin')
    const response = await request(app)
      .get('/api/user/log')
      .set('Cookie', noUserCookie)
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('Bad request, no userId provided')
  })
})

describe('Deleting user', () => {
  it('should not delete user if a disabled user is deleting', async () => {
    const disableDeleteCookie = await login('disabled')
    const response = await request(app)
      .delete('/api/user/delete/someOtherUser')
      .set('Cookie', disableDeleteCookie)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it('should not delete user if a user is deleting another user', async () => {
    const userDeleteOtherCookie = await login('user')
    const response = await request(app)
      .delete('/api/user/delete/someOtherUser')
      .set('Cookie', userDeleteOtherCookie)
    expect(response.statusCode).toBe(401)
    expect(response.text).toBe('Unauthorized access')
  })

  it('should delete user if a user is deleting themselves', async () => {
    const userDeleteSameCookie = await login('user')
    const userSame = await User.findOne({ email: userOne.email })
    const response = await request(app)
      .delete(`/api/user/delete/${String(userSame._id)}`)
      .set('Cookie', userDeleteSameCookie)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('User deleted successfully')
  })

  it('should delete user if an admin is deleting another admin', async () => {
    const adminDeleteDifferentCookie = await login('admin')
    const adminDifferent = await User.findOne({ email: adminTwo.email })
    const response = await request(app)
      .delete(`/api/user/delete/${String(adminDifferent._id)}`)
      .set('Cookie', adminDeleteDifferentCookie)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('User deleted successfully')
  })

  it('should not delete user if only one admin left', async () => {
    const adminDeleteLastCookie = await login('admin')
    const adminLast = await User.findOne({ email: adminOne.email })
    const response = await request(app)
      .delete(`/api/user/delete/${String(adminLast._id)}`)
      .set('Cookie', adminDeleteLastCookie)
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe(
      'Cannot delete, a minimum of 1 admin role is required'
    )
  })

  it('should throw error if id passed is invalid', async () => {
    const adminDeleteLastCookie = await login('admin')
    const response = await request(app)
      .delete('/api/user/delete/invalidId')
      .set('Cookie', adminDeleteLastCookie)
    expect(response.statusCode).toBe(500)
  })
})

afterAll(async () => {
  await teardownLogTests()
})
