const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Utilisation de crypto pour MD5
const config = require('../config/config.json');
const database = require('./database'); // Importez votre module de connexion à la base de données

async function register(login, password) {
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    const sql = 'INSERT INTO personne_login (login, mp) VALUES (?, ?)';
    await database.query(sql, [login, hashedPassword]);
    return { login };
}

async function login(login, password) {
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    const sql = 'SELECT * FROM personne_login WHERE login = ? AND mp = ?';

    const [rows] = await database.query(sql, [login, hashedPassword]);

    if (rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    // Mettre à jour la dernière connexion
    const updateSql = 'UPDATE personne_login SET derniere_connexion = NOW() WHERE id = ?';
    await database.query(updateSql, [rows[0].id]);

    // Générer le token JWT
    const token = jwt.sign({login: rows[0].login }, config.secret, { expiresIn: '1h' });
    console.log(token);
    
    return { token };
}

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        req.login = decoded.login;
        next();
    });
}

module.exports = { register, login, verifyToken };