
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'sparta', password: 'dog'},
        {id: 2, username: 'batman', password: 'iam'}
      ]);
    });
};
