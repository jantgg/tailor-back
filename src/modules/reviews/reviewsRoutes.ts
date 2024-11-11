// /backend/src/modules/restaurants/reviewsRoutes.ts
import { Router } from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from './reviewController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', getAllReviews); // Obtener todas las reseñas (público)
router.get('/:id', getReviewById); // Obtener una reseña por ID (público)

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, createReview); // Crear una reseña
router.put('/:id', authMiddleware, updateReview); // Actualizar una reseña
router.delete('/:id', authMiddleware, deleteReview); // Eliminar una reseña

export default router;
