// /backend/src/modules/auth/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
