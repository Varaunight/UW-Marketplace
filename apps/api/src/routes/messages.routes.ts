import { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import { requireVerified } from '../middleware/requireVerified';
import * as messagesService from '../services/messages.service';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const conversations = await messagesService.getConversations(req.userId!);
    res.json(conversations);
  } catch (err) { next(err); }
});

router.post('/', authenticate, requireVerified, async (req: AuthRequest, res, next) => {
  try {
    const { listingId } = z.object({ listingId: z.string() }).parse(req.body);
    const id = await messagesService.startConversation(req.userId!, listingId);
    res.status(201).json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error) { res.status(400).json({ error: err.message }); return; }
    next(err);
  }
});

router.get('/:id/messages', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const messages = await messagesService.getMessages(req.params.id, req.userId!, page);
    res.json(messages);
  } catch (err) {
    if (err instanceof Error && err.message === 'Not a participant') { res.status(403).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/:id/messages', authenticate, requireVerified, async (req: AuthRequest, res, next) => {
  try {
    const { body } = z.object({ body: z.string().min(1).max(2000) }).parse(req.body);
    const message = await messagesService.sendMessage(req.params.id, req.userId!, body);
    res.status(201).json(message);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error && err.message === 'Not a participant') { res.status(403).json({ error: err.message }); return; }
    next(err);
  }
});

router.patch('/:id/read', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await messagesService.markRead(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
