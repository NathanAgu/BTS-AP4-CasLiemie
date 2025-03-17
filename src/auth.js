const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');

const users = [
    { username: 'user1', password: bcrypt.hashSync('password1', 8) },
    { username: 'user2', password: bcrypt.hashSync('password2', 8) }
];

function register(username, password) {
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, password: hashedPassword });
    return { username };
}

function login(username, password) {
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ username }, config.secret, { expiresIn: '1h' });
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
        next();
    });
}

module.exports = { register, login, verifyToken };