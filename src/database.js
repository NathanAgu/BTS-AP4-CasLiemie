const mysql = require('mysql2/promise');
const config = require('../config/config.json');

// Créer une connexion avec un pool
const database = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});

module.exports = database;