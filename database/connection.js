// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',
//     password : 'test',
//     database : 'brain'
//   }
// });

const db = require('knex')({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
});
module.exports = db;