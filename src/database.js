const mysql = require('mysql');
const config = require('../src/config.json');

const database = mysql.createConnection(config.database);

database.connect();

module.exports = database;