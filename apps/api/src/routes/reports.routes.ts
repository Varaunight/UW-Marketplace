import { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import * as reportsService from '../services/reports.service';

const router = Router();

const reportSchema = z.object({
  reportedListingId: z.string().uuid().optional(),
  reportedUserId:    z.string().uuid().optional(),
  reason: z.enum(['prohibited_item', 'fraud', 'spam', 'harassment', 'fake_listing', 'other']),
  description: z.string().max(500).optional(),
}).refine(
  (d) => d.reportedListingId || d.reportedUserId,
  { message: 'Must report a listing or a user' }
);

router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const body = reportSchema.parse(req.body);

    const duplicate = await reportsService.hasRecentReport(
      req.userId!,
      body.reportedListingId,
      body.reportedUserId
    );
    if (duplicate) {
      res.status(429).json({ error: 'You have already reported this recently.' });
      return;
    }

    await reportsService.createReport({ reporterId: req.userId!, ...body });
    res.status(201).json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    next(err);
  }
});

export default router;
