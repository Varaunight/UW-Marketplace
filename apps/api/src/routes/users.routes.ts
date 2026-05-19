import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import { pool } from '../db/pool';
import { cloudinary } from '../config/cloudinary';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, display_name, avatar_url, email_verified, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (rows.length === 0) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.patch('/me', authenticate, upload.single('avatar'), async (req: AuthRequest, res, next) => {
  try {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (req.body.displayName) {
      const name = z.string().min(2).max(50).parse(req.body.displayName);
      params.push(name);
      sets.push(`display_name = $${params.length}`);
    }

    if (req.file) {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'uw-marketplace/avatars', resource_type: 'image' },
          (err, res) => (err ? reject(err) : resolve(res!))
        );
        stream.end(req.file!.buffer);
      });
      params.push(result.secure_url);
      sets.push(`avatar_url = $${params.length}`);
    }

    if (sets.length > 0) {
      params.push(req.userId);
      await pool.query(
        `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length}`,
        params
      );
    }

    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, display_name, avatar_url, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(rows[0]);
  } catch (err) { next(err); }
});

export default router;
