const Users = require('./auth-model');
const db = require('../database/dbConfig');

beforeEach(async () => {
  await db.seed.run();
});

describe('Find Method', () => {
  it('Finds all users in the database', async () => {
    const res = await Users.find();

    expect(res).toHaveLength(2);
    expect(res[0].username).toBe('batman');
    expect(res[1].username).toBe('sparta');
  });

  it('Does not show user passwords', async () => {
    const res = await Users.find();

    expect(res).toHaveLength(2);
    expect(res[0].password).toBeUndefined();
    expect(res[1].password).toBeUndefined();
  });
});

describe('FindBy Method', () => {
  it('Returns one user if filter is valid', async () => {
    const res = await Users.findBy({ username: 'sparta' }).first();

    expect(res.id).toBe(1);
    expect(res.username).toBe('sparta');
  });

  it('Throws an error if filter is invalid', async () => {
    const res = await Users.findBy();

    expect(res).toBe('Error, a filter must be provided');
  });
});

describe('FindById Method', () => {
  it('Returns one user if ID is valid', async () => {
    const res = await Users.findById(1);

    expect(res.username).toBe('sparta');
  });

  it('Returns undefined if ID is invalid', async () => {
    const res = await Users.findById(5);

    expect(res).toBeUndefined();
  });

  it('Does not show user password', async () => {
    const res = await Users.findById(1);

    expect(res.username).toBe('sparta');
    expect(res.password).toBeUndefined();
  });
});

describe('Add Method', () => {
  it('Adds user to database is valid information sent', async () => {
    const res = await Users.add({ username: "Ed", password: "Sheeran" });

    expect(res.id).toBe(3);
    expect(res.username).toBe('Ed');
    expect(res.password).toBeUndefined();
  });

  it('Throws an error if username or password not provided', async () => {
    const res = await Users.add();

    expect(res).toBe('Error, new users must have a username and password');
  });
});