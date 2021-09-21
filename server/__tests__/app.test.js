import supertest from 'supertest'
import app from '../app'

describe('POST /users', () => {

    describe('given a username and password', () => {
        //should save the username and password to the database
        // should respond with json object containing the user id
        // should respond with a 200 status code
        test("should respond with a 200 status code", () => {
            const response = await request(app).post('/users').send({
                username: 'username',
                password: 'password'
            })
            expect(response.statusCode).toBe(200)
        })
        // should specify json in the content type header
    })

    describe('when the ussername and password is missing', () => {
        // should respond with 404 status code
    })
})