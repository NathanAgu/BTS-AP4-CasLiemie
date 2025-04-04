const express = require('express');
const dynamicRoutes = require('./routes/dynamicRoutes');
const auth = require('./auth');

const app = express();


app.use(express.json());
app.use('/table', dynamicRoutes);
app.post('/register', (req, res) => {
    try {
        const user = auth.register(req.body.username, req.body.password);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const token = await auth.login(req.body.username, req.body.password);
        res.status(200).send(token);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/protected', auth.verifyToken, (req, res) => {
    res.status(200).send({ message: 'This is a protected route' });
});

module.exports = app;