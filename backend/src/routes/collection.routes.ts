import { Router } from 'express';
import { addCollection, renameCollection, deleteCollection, getCollectionsByUser } from '../controllers/collection.controller';

const router = Router();

// POST /api/collections
router.post('/', addCollection);

// PATCH /api/collections/:id
router.patch('/:id', renameCollection);

// DELETE /api/collections/:id
router.delete('/:id', deleteCollection);

// GET /api/collections/user/:userId
router.get('/user/:userId', getCollectionsByUser);

export default router;
