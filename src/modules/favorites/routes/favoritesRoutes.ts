// src/modules/favorites/routes/favoritesRoutes.ts

import { Router } from 'express';
import { favoriteRepository } from '../../../utils/createRepositories';
import { generateCrudRoutes } from '../../../utils/crudGenerator';

const router = Router();

// Generar rutas CRUD para Favorite
router.use('/', generateCrudRoutes({ repository: favoriteRepository, protected: true }));

export default router;
