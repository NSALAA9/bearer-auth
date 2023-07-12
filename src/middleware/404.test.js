'use strict'

const supertest = require('supertest');
const {app} = require('../server');
const req = supertest(app);

describe('Server test', () => {
    it('Page not found, bad route', async () => {
      const res = await req.get('/hola');
      expect(res.status).toEqual(404);
    })

    it('Page not found, bad request', async () => {
      const res = await req.put('/hola');
      expect(res.status).toEqual(404);
    })
})