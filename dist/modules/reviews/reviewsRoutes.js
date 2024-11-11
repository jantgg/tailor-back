"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /backend/src/modules/restaurants/reviewsRoutes.ts
const express_1 = require("express");
const reviewController_1 = require("./reviewController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', reviewController_1.getAllReviews); // Obtener todas las reseñas (público)
router.get('/:id', reviewController_1.getReviewById); // Obtener una reseña por ID (público)
// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware_1.authMiddleware, reviewController_1.createReview); // Crear una reseña
router.put('/:id', authMiddleware_1.authMiddleware, reviewController_1.updateReview); // Actualizar una reseña
router.delete('/:id', authMiddleware_1.authMiddleware, reviewController_1.deleteReview); // Eliminar una reseña
exports.default = router;
