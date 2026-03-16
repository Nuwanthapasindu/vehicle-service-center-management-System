const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controller/supplier.controller'); // Folder eka 'controller' hari 'controllers' hari kiyala sure karaganna

// GET: All suppliers ganna
router.get('/', supplierCtrl.getAllSuppliers);

// POST: Aluth supplier kenek add karanna
router.post('/', supplierCtrl.createSupplier);

// PUT: Supplier details update karanna
router.put('/:id', supplierCtrl.updateSupplier);

// DELETE: Supplier kenekwa remove karanna (Soft delete)
router.delete('/:id', supplierCtrl.deleteSupplier);

module.exports = router;