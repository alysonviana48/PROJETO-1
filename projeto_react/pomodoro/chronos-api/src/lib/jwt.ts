import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'chronos-secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): { userId: number; email: string } {
  return jwt.verify(token, SECRET) as { userId: number; email: string };
}