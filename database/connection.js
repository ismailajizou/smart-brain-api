const connection = process.env.NODE_ENV === "development" ? {
  host : '127.0.0.1',
  user : 'postgres',
  password : 'test',
  database : 'brain'
} : {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}


const db = require('knex')({
    client: 'pg',
    connection: connection
});
module.exports = db;