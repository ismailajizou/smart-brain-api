const devModeConnection  = {
  host : '127.0.0.1',
  user : process.env.DATABASE_USER,
  password : process.env.DATABASE_PWD,
  database : process.env.DATABASE_NAME
}
const prodModeConnection = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}

const connection = process.env.NODE_ENV === "dev" ? devModeConnection : prodModeConnection;

const db = require('knex')({
  client: 'pg',
  connection: connection
});

module.exports = db;