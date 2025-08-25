import { Router } from 'express';
import { createRequest, updateRequest, deleteRequest, getRequest, getRequestsByCollection } from '../controllers/request.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Create request
router.post('/', authenticateToken, createRequest);

// Update request by ID
router.patch('/:id', authenticateToken, updateRequest);

// Delete request by ID
router.delete('/:id', authenticateToken, deleteRequest);

// Get request by ID
router.get('/:id', authenticateToken, getRequest);

// Get all request by collection ID
router.get('/collection/:id', authenticateToken, getRequestsByCollection);

export default router;
