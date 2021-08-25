const { Client } = require('pg')

const dbClient = new Client({
  user: 'http_user',
  host: 'localhost',
  database: 'connections',
  password: 'secret',
  port: 5432,
});

module.exports = dbClient;
