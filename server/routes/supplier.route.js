const express = require('express');
const router = express.Router();
const ctrl = require('../controller/supplier.controller');

router.get('/', ctrl.getAllSuppliers);
router.post('/', ctrl.createSupplier);
router.put('/:id', ctrl.updateSupplier);
router.delete('/:id', ctrl.deleteSupplier);

module.exports = router;