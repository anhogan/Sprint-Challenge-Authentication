const request = require('supertest');

const server = require('../api/server');

const db = require('../database/dbConfig');

beforeEach(async () => {
  await db.seed.run();
});

describe('Register Endpoint', () => {
  it('Registers a new user', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe('Jaxxx');
    expect(res.body.user.id).toBe(3);
    expect(res.type).toBe('application/json');
  });

  it('Validates that a username and password are included', async () => {
    const res = await request(server).post('/api/auth/register').send({});

    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('Missing user data');
  });

  it('Generates a token', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe('Jaxxx');
    expect(res.body.user.id).toBe(3);
    expect(res.body.token).toBeTruthy();
  });
});

describe('Login Endpoint', () => {
  it('Logs in when valid credentials are provided', async () => {
    await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });

    const login = await request(server).post('/api/auth/login').send({ username: "Jaxxx", password: "password" });

    expect(login.statusCode).toBe(200);
    expect(login.body.message).toBe('Welcome Jaxxx');
    expect(login.type).toBe('application/json');
  });

  it('Validates that user data is included', async () => {
    await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });

    const login = await request(server).post('/api/auth/login').send({});

    expect(login.statusCode).toBe(400);
    expect(login.type).toBe('application/json');
    expect(login.body.message).toBe('Missing user data');
  });

  it('Validates that both a username and password are included', async () => {
    await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });

    const login = await request(server).post('/api/auth/login').send({ username: "Jaxxx" });

    expect(login.statusCode).toBe(400);
    expect(login.type).toBe('application/json');
    expect(login.body.message).toBe('Each user must have a username and a password');
  });

  it('Generates a token', async () => {
    await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });

    const login = await request(server).post('/api/auth/login').send({ username: "Jaxxx", password: "password" });

    expect(login.statusCode).toBe(200);
    expect(login.body.message).toBe('Welcome Jaxxx');
    expect(login.body.token).toBeTruthy();
  });

  it('Returns a 401 error if user credentials are invalid', async () => {
    await request(server).post('/api/auth/register').send({ username: "Jaxxx", password: "password" });
    
    const login = await request(server).post('/api/auth/login').send({ username: 'Jax', password: 'pass' });

    expect(login.statusCode).toBe(401);
    expect(login.type).toBe('application/json');
    expect(login.body.message).toBe('Invalid credentials');
  });
});

// NEED TO WRITE THESE
describe('Logout Endpoint', () => {
  it('Logs the user out if authorization header is present', async () => {

  });

  it('Throws an error if user is not logged in', async () => {

  });
});