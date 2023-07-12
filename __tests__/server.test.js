'use strict'

const { app } = require("../src/server");
const { DB } = require("../src/auth/models/index");
const supertest = require('supertest');
const mockServer = supertest(app);
const base64 = require('base-64')
const basicAuthMiddleWare = require('../src/auth/middleware/basic')

beforeAll(async () => {
  await DB.sync();
});

afterAll(async () => {
  await DB.drop();
});
  
// Test endpoints
describe('Test the signin & signup endpoints', () => {

  it(' POST to /signup to create a new user.  ', async () => {
    const result = await mockServer.post('/signup').send({
      userName: 'Alaa',
      password: '1234'
    });
    expect(result.status).toEqual(201);
  });

  it('POST to /signin to login as a user (use basic auth).  ', async () => {
    const req = {
      headers: {
        authorization: `Basic ${base64.encode('Alaa:1234')}`
      },
      body: {
        userName: undefined
      }
    };

    const res = {};
    const next = jest.fn();
    await basicAuthMiddleWare(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});