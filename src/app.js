const express = require('express');
const dynamicRoutes = require('./routes/dynamicRoutes');

const app = express();


app.use(express.json());
app.use('/table', dynamicRoutes);

module.exports = app;