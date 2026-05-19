import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  emailVerified?: boolean;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      email: string;
      verified: boolean;
    };
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.emailVerified = payload.verified;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
