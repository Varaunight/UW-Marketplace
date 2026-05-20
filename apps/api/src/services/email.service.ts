import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${env.WEB_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: 'UW Marketplace <noreply@uwmarketplace.ca>',
    to,
    subject: 'Reset your UW Marketplace password',
    html: `
      <h2>Password reset request</h2>
      <p>Click the link below to set a new password. This link expires in 1 hour.</p>
      <a href="${link}">${link}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${env.WEB_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: 'UW Marketplace <noreply@uwmarketplace.ca>',
    to,
    subject: 'Verify your UW Marketplace account',
    html: `
      <h2>Welcome to UW Marketplace!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
