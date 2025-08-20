import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token
  
  if (!token) return res.status(401).json({ message: 'Token required' });
  const payload = verifyToken(token);
  if (!payload) return res.status(403).json({ message: 'Invalid token' });
  
  req.userId = payload.userId;
  next();
}
