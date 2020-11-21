const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const mongoose = require('mongoose')

const User = require('../models/user')

const api = supertest(app)

describe('Checking post request of to end point users', () => {
  test('Check that invalid users are not created when password has length less than 3', async () => {
    const newUser = {
      username: 'han',
      name: 'hang',
      password: 'ds',
    }
    await api.post('/api/users').send(newUser).expect(400)
  })

  test('Check that invalid users are not created when username has length less than 3', async () => {
    const newUser = {
      username: 'ha',
      name: 'hang',
      password: 'dsdasds',
    }
    await api.post('/api/users').send(newUser).expect(400)
  })

  test('Check that users are not created when username is missing', async () => {
    const newUser = {
      name: 'hang',
      password: 'dsdasds',
    }
    await api.post('/api/users').send(newUser).expect(400)
  })

  test('Check that users are not created when password is missing', async () => {
    const newUser = {
      username: 'hadsds',
      name: 'hang',
    }
    await api.post('/api/users').send(newUser).expect(400)
  })
})

afterAll(async () => await mongoose.connection.close())
