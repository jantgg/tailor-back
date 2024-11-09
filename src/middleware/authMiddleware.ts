// /backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/auth/types/usersTypes';

const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
};
