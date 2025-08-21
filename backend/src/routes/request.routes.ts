import { Router } from 'express';
import { createRequest, updateRequest, deleteRequest, getRequest } from '../controllers/request.controller';
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

export default router;
