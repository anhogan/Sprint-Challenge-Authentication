const request = require('supertest');

const server = require('../api/server');

const db = require('../database/dbConfig');

beforeEach(async () => {
  await db.seed.run();
});

describe('GET Endpoint', () => {
  it('Gets a list of dad jokes', async () => {
    const register = await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });
    const token = register.body.token;

    const res = await request(server).get('/api/jokes').set({ authorization: token });

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });

  it('Returns a 400 error if not logged in', async () => {
    const res = await request(server).get('/api/jokes');

    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('You must be logged in to access this page');
  });
});