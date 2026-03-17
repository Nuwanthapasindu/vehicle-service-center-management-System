const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controller/supplier.controller'); // Folder eka 'controller' hari 'controllers' hari kiyala sure karaganna

router.get('/', supplierCtrl.getAllSuppliers);

router.post('/', supplierCtrl.createSupplier);

router.put('/:id', supplierCtrl.updateSupplier);

router.delete('/:id', supplierCtrl.deleteSupplier);

module.exports = router;