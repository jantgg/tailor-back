// src/modules/restaurants/routes/restaurantsRoutes.ts

import { Router } from 'express';
import { restaurantRepository } from '../../../utils/createRepositories';
import { generateCrudRoutes } from '../../../utils/crudGenerator';

const router = Router();

// Generar rutas CRUD para Restaurant
router.use('/', generateCrudRoutes({ repository: restaurantRepository, protected: true }));

export default router;
