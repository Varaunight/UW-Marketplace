import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import { requireVerified } from '../middleware/requireVerified';
import * as listingsService from '../services/listings.service';
import * as imagesService from '../services/images.service';
import { pool } from '../db/pool';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (req, res, next) => {
  try {
    const query = {
      q: req.query.q as string | undefined,
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 48) : 24,
    };
    const result = await listingsService.getListings(query);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/categories', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, slug, label FROM categories ORDER BY label');
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const listing = await listingsService.getListingById(req.params.id);
    if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; }
    res.json(listing);
  } catch (err) { next(err); }
});

const createSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().min(0),
  categoryId: z.number().int().positive(),
});

router.post('/', authenticate, requireVerified, async (req: AuthRequest, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const id = await listingsService.createListing(req.userId!, body);
    res.status(201).json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    next(err);
  }
});

const updateSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().min(0).optional(),
  categoryId: z.number().int().positive().optional(),
  status: z.enum(['active', 'sold', 'deleted']).optional(),
});

router.patch('/:id', authenticate, requireVerified, async (req: AuthRequest, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    await listingsService.updateListing(req.params.id, req.userId!, body);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    next(err);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await listingsService.deleteListing(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Image routes
router.post('/:id/images', authenticate, requireVerified, upload.single('image'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
    const image = await imagesService.uploadImage(req.params.id, req.file.buffer, req.file.mimetype);
    res.status(201).json(image);
  } catch (err) { next(err); }
});

router.delete('/:id/images/:imageId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await imagesService.deleteImage(req.params.id, req.params.imageId, req.userId!);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === 'Not authorized') { res.status(403).json({ error: err.message }); return; }
    next(err);
  }
});

router.patch('/:id/images/order', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { orderedIds } = z.object({ orderedIds: z.array(z.string()) }).parse(req.body);
    await imagesService.reorderImages(req.params.id, req.userId!, orderedIds);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    next(err);
  }
});

export default router;
