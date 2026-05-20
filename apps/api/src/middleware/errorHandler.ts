import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', details: err.errors });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('not found')) { res.status(404).json({ error: err.message }); return; }
    if (msg.includes('unauthorized') || msg.includes('invalid token')) { res.status(401).json({ error: err.message }); return; }
    if (msg.includes('forbidden') || msg.includes('not authorized')) { res.status(403).json({ error: err.message }); return; }
    if (msg.includes('duplicate') || msg.includes('already exists')) { res.status(409).json({ error: err.message }); return; }
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
