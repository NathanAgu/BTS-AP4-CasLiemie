const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/dynamicController.js');

router.get('/:tableName', dynamicController.getTableData);

module.exports = router;