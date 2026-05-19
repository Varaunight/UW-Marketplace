import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';

export function requireVerified(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.emailVerified) {
    res.status(403).json({ error: 'Email not verified' });
    return;
  }
  next();
}
