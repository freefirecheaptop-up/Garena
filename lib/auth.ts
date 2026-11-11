import { NextRequest } from 'next/server';

export const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'ff_admin_sec_8892';

export function isAuthorizedAdmin(req: NextRequest): boolean {
  // Check header Authorization or custom x-admin-key
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.replace(/^Bearer\s+/i, '').trim() === ADMIN_SECRET) {
    return true;
  }
  const customHeader = req.headers.get('x-admin-key');
  if (customHeader && customHeader.trim() === ADMIN_SECRET) {
    return true;
  }
  // Check cookie
  const cookie = req.cookies.get('ff_admin_token');
  if (cookie && cookie.value === ADMIN_SECRET) {
    return true;
  }
  return false;
}
