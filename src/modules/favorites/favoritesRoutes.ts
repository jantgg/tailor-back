// src/modules/favorites/favoritesRoutes.ts
import { Router } from 'express';
import { getFavoritesByUser, addFavorite, removeFavorite } from './favoriteController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getFavoritesByUser); // Obtener los favoritos del usuario autenticado
router.post('/', authMiddleware, addFavorite); // Agregar un restaurante a favoritos
router.delete('/:restaurantId', authMiddleware, removeFavorite); // Eliminar un restaurante de favoritos

export default router;
