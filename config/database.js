const { Client } = require('pg')

const dbClient = new Client({
  user: 'general_user',
  host: 'localhost',
  database: 'immobilien',
  password: 'secret',
  port: 5432,
});

module.exports = dbClient;
