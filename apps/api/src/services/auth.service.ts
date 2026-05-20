import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { pool } from '../db/pool';
import { env } from '../config/env';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';

const UW_DOMAIN = '@uwaterloo.ca';
const JWT_EXPIRES = '15m';
const REFRESH_EXPIRES = '30d';

function assertUWEmail(email: string) {
  if (!email.endsWith(UW_DOMAIN)) {
    throw new Error('Only @uwaterloo.ca emails are allowed');
  }
}

function issueTokens(userId: string, email: string, verified: boolean) {
  const access = jwt.sign(
    { sub: userId, email, verified },
    env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
  const refresh = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
  return { access, refresh };
}

export async function register(email: string, password: string, displayName: string) {
  assertUWEmail(email.toLowerCase());
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) throw new Error('Email already registered');

  const hash = await bcrypt.hash(password, 12);

  // In development, skip email verification and auto-verify accounts
  if (env.NODE_ENV === 'development') {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, email_verified)
       VALUES ($1, $2, $3, TRUE) RETURNING id`,
      [email.toLowerCase(), hash, displayName]
    );
    console.log(`[dev] Auto-verified account for ${email.toLowerCase()}`);
    return { userId: rows[0].id };
  }

  const verifyToken = randomUUID();
  const verifyExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, display_name, verify_token, verify_token_exp)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [email.toLowerCase(), hash, displayName, verifyToken, verifyExp]
  );

  await sendVerificationEmail(email.toLowerCase(), verifyToken);
  return { userId: rows[0].id };
}

export async function login(email: string, password: string) {
  const { rows } = await pool.query(
    'SELECT id, password_hash, email_verified FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  if (rows.length === 0) throw new Error('Invalid credentials');

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');

  const tokens = issueTokens(user.id, email.toLowerCase(), user.email_verified);

  // Store refresh token
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
    [user.id, tokens.refresh]
  );

  return tokens;
}

export async function verifyEmail(token: string) {
  const { rows } = await pool.query(
    `SELECT id FROM users WHERE verify_token = $1 AND verify_token_exp > NOW() AND email_verified = FALSE`,
    [token]
  );
  if (rows.length === 0) throw new Error('Invalid or expired verification token');

  await pool.query(
    `UPDATE users SET email_verified = TRUE, verify_token = NULL, verify_token_exp = NULL WHERE id = $1`,
    [rows[0].id]
  );
}

export async function refreshTokens(refreshToken: string) {
  let payload: { sub: string };
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
  } catch {
    throw new Error('Invalid refresh token');
  }

  const { rows: tokenRows } = await pool.query(
    'SELECT id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [refreshToken]
  );
  if (tokenRows.length === 0) throw new Error('Refresh token revoked or expired');

  const { rows: userRows } = await pool.query(
    'SELECT email, email_verified FROM users WHERE id = $1',
    [payload.sub]
  );
  if (userRows.length === 0) throw new Error('User not found');

  // Rotate refresh token
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  const tokens = issueTokens(payload.sub, userRows[0].email, userRows[0].email_verified);
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
    [payload.sub, tokens.refresh]
  );

  return tokens;
}

export async function logout(refreshToken: string) {
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
}

export async function findOrCreateMicrosoftUser(email: string, displayName: string, microsoftId: string) {
  const normalizedEmail = email.toLowerCase();
  if (!normalizedEmail.endsWith('@uwaterloo.ca')) {
    throw new Error('Only @uwaterloo.ca accounts are allowed');
  }

  const { rows } = await pool.query(
    'SELECT id, email_verified FROM users WHERE email = $1',
    [normalizedEmail]
  );

  let userId: string;
  if (rows.length > 0) {
    userId = rows[0].id;
    // Ensure SSO users are always marked verified
    if (!rows[0].email_verified) {
      await pool.query('UPDATE users SET email_verified = TRUE WHERE id = $1', [userId]);
    }
  } else {
    const { rows: inserted } = await pool.query(
      `INSERT INTO users (email, display_name, email_verified, microsoft_id)
       VALUES ($1, $2, TRUE, $3) RETURNING id`,
      [normalizedEmail, displayName, microsoftId]
    );
    userId = inserted[0].id;
  }

  const access = jwt.sign(
    { sub: userId, email: normalizedEmail, verified: true },
    env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
  return { accessToken: access, userId };
}

export async function requestPasswordReset(email: string) {
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE email = $1 AND password_hash IS NOT NULL',
    [email.toLowerCase()]
  );
  // Return silently if email not found — don't reveal whether an account exists
  if (rows.length === 0) return;

  const token = randomUUID();
  const exp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_exp = $2 WHERE id = $3',
    [token, exp, rows[0].id]
  );
  await sendPasswordResetEmail(email.toLowerCase(), token);
}

export async function resetPassword(token: string, newPassword: string) {
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE reset_token = $1 AND reset_token_exp > NOW()',
    [token]
  );
  if (rows.length === 0) throw new Error('Invalid or expired reset link');

  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_exp = NULL WHERE id = $2',
    [hash, rows[0].id]
  );
}

export async function resendVerification(userId: string) {
  const { rows } = await pool.query(
    'SELECT email, email_verified FROM users WHERE id = $1',
    [userId]
  );
  if (rows.length === 0 || rows[0].email_verified) return;

  const verifyToken = randomUUID();
  const verifyExp = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query(
    'UPDATE users SET verify_token = $1, verify_token_exp = $2 WHERE id = $3',
    [verifyToken, verifyExp, userId]
  );
  await sendVerificationEmail(rows[0].email, verifyToken);
}
