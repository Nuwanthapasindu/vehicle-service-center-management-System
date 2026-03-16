const express = require('express');
const router = express.Router();
const orderCtrl = require('../controller/order.controller');

// GET: All orders list eka ganna
router.get('/', orderCtrl.getAllOrders);

// POST: Aluth order ekak (Draft hari Sent hari) create karanna
router.post('/', orderCtrl.createOrder);

// PUT: Order eka 'Received' karanna saha Inventory eka auto update karanna
router.put('/:id/receive', orderCtrl.receiveOrder);

// DELETE: Order ekak delete karanna
router.delete('/:id', orderCtrl.deleteOrder);

module.exports = router;