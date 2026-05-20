import { Router } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/authenticate';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const microsoftSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  microsoftId: z.string(),
});

router.post('/microsoft', async (req, res, next) => {
  try {
    const body = microsoftSchema.parse(req.body);
    const result = await authService.findOrCreateMicrosoftUser(body.email, body.displayName, body.microsoftId);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error) { res.status(400).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body.email, body.password, body.displayName);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error) { res.status(400).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const tokens = await authService.login(body.email, body.password);
    res.cookie('refreshToken', tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: tokens.access });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error) { res.status(401).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/verify-email', async (req, res, next) => {
  try {
    const { token } = z.object({ token: z.string() }).parse(req.body);
    await authService.verifyEmail(token);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error) { res.status(400).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) { res.status(401).json({ error: 'No refresh token' }); return; }
    const tokens = await authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: tokens.access });
  } catch (err) {
    if (err instanceof Error) { res.status(401).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    await authService.requestPasswordReset(email);
    // Always return 200 so we don't reveal whether an account exists
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = z.object({
      token: z.string(),
      password: z.string().min(8),
    }).parse(req.body);
    await authService.resetPassword(token, password);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    if (err instanceof Error) { res.status(400).json({ error: err.message }); return; }
    next(err);
  }
});

router.post('/resend-verification', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await authService.resendVerification(req.userId!);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
