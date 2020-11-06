const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = helper.users.map(user => new User(user));
  const promiseArr = userObjects.map(user => user.save());
  await Promise.all(promiseArr);
});

describe('invalid username posts', () => {
  test('invalid username returns 400', async () => {
    const invalidUser = {
      username: 'I',
      name: 'guy',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('missing username returns 400', async () => {
    const invalidUser = {
      username: '',
      name: 'guy',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('duplicate username returns 400', async () => {
    const invalidUser = {
      username: 'Dude Man',
      name: 'guy',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('invalid password posts', () => {
  test('missing password returns 400', async () => {
    const invalidUser = {
      username: 'Dude Man 10',
      name: 'guy',
      password: ''
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('invalid password returns 400', async () => {
    const invalidUser = {
      username: 'Dude Person',
      name: 'guy',
      password: 'p'
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
