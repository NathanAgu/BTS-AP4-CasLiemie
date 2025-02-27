const express = require('express');
const dynamicRoutes = require('./routes/dynamicRoutes');

const app = express();


app.use(express.json());
app.use('/', (req, res) => {res.send('AP4 Api - Nathan AGU');});
app.use('/table', dynamicRoutes);

module.exports = app;