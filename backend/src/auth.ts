import { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { config } from './config';

function base64url(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function decode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export function createToken(userId: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ userId, exp: Date.now() + 86400000 })); // 1 day
  const signature = createHmac('sha256', config.secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token?: string): { userId: string } | null {
  if (!token) return null;
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return null;

  const expected = createHmac('sha256', config.secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  // timingSafeEqual prevents timing attacks when comparing signatures
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expBuffer.length || !timingSafeEqual(sigBuffer, expBuffer)) return null;

  const { userId, exp } = JSON.parse(decode(payload));
  if (Date.now() > exp) return null; // token expired

  return { userId };
}

export function authenticate(
  req: Request,
  res: Response<Record<string, unknown>>,
  next: NextFunction,
): void {
  console.log(req.body);
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.body.userId = payload.userId;
  console.log(req.body);
  next();
}
