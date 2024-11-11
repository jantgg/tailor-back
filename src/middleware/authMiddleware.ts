// /backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/auth/usersTypes';

const SECRET_KEY = process.env.JWT_SECRET || 'la_clave_secreta_123';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  console.log("Authorization Header:", authHeader); // Verificar que el encabezado esté presente
  console.log("Token:", token); // Verificar el token extraído

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log para ver el error específico
    res.status(401).json({ error: 'Token no válido' });
  }
};
