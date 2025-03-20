const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/dynamicController');

router.get('/:tableName', dynamicController.getTableData);
router.get('/:tableName/:id', dynamicController.getByIdTableData);
router.post('/:tableName', dynamicController.addTableData);
router.put('/:tableName/:id', dynamicController.putTableData);
router.delete('/:tableName/:id', dynamicController.deleteTableData);

module.exports = router;