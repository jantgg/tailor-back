// src/modules/reviews/routes/reviewsRoutes.ts

import { Router } from 'express';
import { reviewRepository } from '../../../utils/createRepositories';
import { generateCrudRoutes } from '../../../utils/crudGenerator';

const router = Router();

// Generar rutas CRUD para Review
router.use('/', generateCrudRoutes({ repository: reviewRepository, protected: true }));

export default router;
