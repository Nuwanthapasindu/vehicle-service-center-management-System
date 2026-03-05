const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');
const { authTokenMiddleware } = require('../middleware/auth');

router.get('/', categoryController.getAllCategories);
router.post('/', authTokenMiddleware, categoryController.createCategory);
router.patch('/:id', authTokenMiddleware, categoryController.updateCategory);
router.delete('/:id', authTokenMiddleware, categoryController.deleteCategory);

module.exports = router;