import { Router } from 'express';
import { register, login, editProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

//POST /api/auth/update
router.post('/edit', authenticateToken, editProfile);

export default router;
