'use strict';

process.env.SECRET = "TEST_SECRET";

const bearer = require('./middleware/bearer');
const { DB, User } = require('./models/index');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { userName: 'admin', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await DB.sync();
  await User.create(userInfo.admin);
});
afterAll(async () => {
  await DB.drop();
});

describe('Auth Middleware', () => {

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  }
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with an incorrect token', () => {

      req.headers = {
        authorization: 'Bearer this is a bad token',
      };

      return bearer(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalled();
        });

    });

    it('logs in a user with a proper token', () => {

      const user = { userName: 'admin' };
      const token = jwt.sign(user, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      return bearer(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });
  });
});