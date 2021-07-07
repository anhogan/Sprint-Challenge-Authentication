const db = require('../database/dbConfig');

module.exports = {
  find,
  findBy,
  findById,
  add
};

function find() {
  return db('users').select('id', 'username');
};

function findBy(filter) {
  if (filter) {
    return db('users').where(filter);
  } else {
    return 'Error, a filter must be provided';
  };
};

function findById(id) {
  return db('users').where({ id }).select('id', 'username').first();
};

async function add(user) {
  if (user) {
    const [id] = await db('users').insert(user);

    return findById(id);
  } else {
    return 'Error, new users must have a username and password';
  };
};