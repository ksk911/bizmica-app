const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});
pool.on('connection', function (connection) {
  console.log('Connection %d connected', connection.threadId);
});
pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

module.exports = pool;
