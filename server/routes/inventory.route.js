const express = require('express');
const router = express.Router();
const InventoryController = require('../controller/inventory.controller');
const { authTokenMiddleware } = require('../middleware/auth');

router.get('/', InventoryController.getInventory);
router.post('/', authTokenMiddleware, InventoryController.addItem);

router.patch('/adjust/:id', authTokenMiddleware, InventoryController.manualAdjustment);
router.patch('/reduce-stock', authTokenMiddleware, InventoryController.reduceStockByInvoice);
router.patch('/increase-stock', authTokenMiddleware, InventoryController.increaseStockByPO);

router.patch('/:id', authTokenMiddleware, InventoryController.updateItem);
router.delete('/:id', authTokenMiddleware, InventoryController.deleteItem);

module.exports = router;