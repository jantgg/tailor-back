// /backend/src/modules/restaurants/restaurantsRoutes.ts
import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from './restaurantController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Rutas de restaurantes
router.get('/', getAllRestaurants); // Obtener todos los restaurantes (público)
router.get('/:id', getRestaurantById); // Obtener un restaurante por ID (público)

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, createRestaurant); // Crear un nuevo restaurante
router.put('/:id', authMiddleware, updateRestaurant); // Actualizar un restaurante
router.delete('/:id', authMiddleware, deleteRestaurant); // Eliminar un restaurante

export default router;
