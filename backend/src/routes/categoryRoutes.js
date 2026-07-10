import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { verifyAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:categoryId/providers', categoryController.getProvidersByCategory);

// Admin only
router.post('/', verifyAuth, authorize(['admin']), categoryController.createCategory);
router.patch('/:id', verifyAuth, authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', verifyAuth, authorize(['admin']), categoryController.deleteCategory);

export default router;
