const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controller/purchaseOrder.controller');

router.get('/', purchaseOrderController.getAllOrders);
router.post('/', purchaseOrderController.createOrder);
router.put('/:id/receive', purchaseOrderController.markAsReceived);
router.delete('/:id', purchaseOrderController.deleteOrder);

module.exports = router;
