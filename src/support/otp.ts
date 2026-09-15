import { createGuardrails, generateSync } from 'otplib';

export function generateCurrentOtp(): string {
  const secret = process.env.MFA_TOTP_SECRET?.trim();

  if (!secret) {
    throw new Error('MFA_TOTP_SECRET is not configured');
  }

  return generateSync({
    secret,
    algorithm: 'sha1',
    digits: 6,
    period: 30,
    guardrails: createGuardrails({ MIN_SECRET_BYTES: 10 })
  });
}