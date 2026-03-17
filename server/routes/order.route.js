const express = require('express');
const router = express.Router();
const orderCtrl = require('../controller/order.controller');

router.get('/', orderCtrl.getAllOrders);

router.post('/', orderCtrl.createOrder);

router.put('/:id/receive', orderCtrl.receiveOrder);

router.delete('/:id', orderCtrl.deleteOrder);

module.exports = router;