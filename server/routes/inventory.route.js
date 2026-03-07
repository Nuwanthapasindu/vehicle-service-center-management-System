const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventory.controller');

router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', inventoryController.getLowStock);

module.exports = router;
