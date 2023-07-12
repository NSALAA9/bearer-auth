'use strict';

process.env.SECRET = "TEST_SECRET";

const base64 = require('base-64');
const middleware = require('./middleware/basic');
const { DB, User } = require('./models/index');

let userInfo = {
  admin: { userName: 'admin-basic', password: 'password' },
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

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {
      const basicAuthString = base64.encode('username:password');
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalled();
  

        });

    });
    it('logs in an admin user with the right credentials', () => {
        let basicAuthString = base64.encode(`${userInfo.admin.userName}:${userInfo.admin.password}`);
        req.headers = {
          authorization: `Basic ${basicAuthString}`,
        };
      
        return middleware(req, res, next)
          .then(() => {
            expect(next).toHaveBeenCalled();
          });
      });     
})
})