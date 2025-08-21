import { Router } from 'express';
import { addCollection, renameCollection, deleteCollection, getCollectionsByUser } from '../controllers/collection.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/collections
router.post('/', authenticateToken, addCollection);

// PATCH /api/collections/:id
router.patch('/:id', authenticateToken, renameCollection);

// DELETE /api/collections/:id
router.delete('/:id', authenticateToken, deleteCollection);

// GET /api/collections/user/:userId
router.get('/user/:userId', authenticateToken, getCollectionsByUser);

export default router;
