import { Router } from 'express';
import { createRequest, updateRequest, deleteRequest, getRequest } from '../controllers/request.controller';

const router = Router();

// Create request
router.post('/', createRequest);

// Update request by ID
router.patch('/:id', updateRequest);

// Delete request by ID
router.delete('/:id', deleteRequest);

// Get request by ID
router.get('/:id', getRequest);

export default router;
