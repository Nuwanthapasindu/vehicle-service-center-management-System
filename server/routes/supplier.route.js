const express = require('express');
const router = express.Router();
const supplierController = require('../controller/supplier.controller');


const { validateSupplier } = require('../validation/supplier.validation');

router.post('/', validateSupplier, supplierController.createSupplier);

router.get('/', supplierController.getAllSuppliers);

router.put('/:id', validateSupplier, supplierController.updateSupplier);

router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;