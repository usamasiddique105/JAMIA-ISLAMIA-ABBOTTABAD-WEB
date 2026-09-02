import crypto from 'crypto';

export const AUTHORIZED_ADMIN_EMAIL = 'jamiaislamia2003@gmail.com';
export const AUTHORIZED_ADMIN_USERNAME = 'jamiaislamia';

export function isAuthorizedAdminUser(identifier: string): boolean {
  const clean = (identifier || '').trim().toLowerCase();
  return (
    clean === 'jamiaislamia' ||
    clean === 'jamiaislamia2003' ||
    clean === 'admin' ||
    clean === 'superadmin' ||
    clean === AUTHORIZED_ADMIN_EMAIL.toLowerCase() ||
    clean === 'admin@jamiaislamia.edu.pk' ||
    clean === 'admin@jamiaislamia.pk'
  );
}
const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// In-Memory Rate Limiter for Login Attempts
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { allowed: true };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    const waitSeconds = Math.ceil(LOCKOUT_MS / 1000);
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

export function resetAttempts(key: string): void {
  loginAttempts.delete(key);
}
