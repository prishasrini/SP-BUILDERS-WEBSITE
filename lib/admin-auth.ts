import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

// Admin login: one password, set as ADMIN_PASSWORD in Vercel (and in .env.local for local use).
// A signed cookie keeps you logged in for 7 days.

const COOKIE = 'spb_admin';
const WEEK = 7 * 24 * 60 * 60;

const secret = () => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) return null;
  return `${password}:${process.env.ADMIN_SESSION_SECRET ?? 'sp-builders-admin'}`;
};

const sign = (value: string, key: string) => createHmac('sha256', key).update(value).digest('base64url');

const equal = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const adminConfigured = () => secret() !== null;

export function passwordMatches(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !secret()) return false;
  const key = 'compare';
  return equal(sign(input, key), sign(password, key));
}

export async function startSession() {
  const key = secret();
  if (!key) throw new Error('ADMIN_PASSWORD is not set');
  const expires = Math.floor(Date.now() / 1000) + WEEK;
  const store = await cookies();
  store.set(COOKIE, `${expires}.${sign(String(expires), key)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: WEEK });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const key = secret();
  if (!key) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  return equal(signature, sign(expires, key));
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Your admin session has expired. Please log in again.');
}
