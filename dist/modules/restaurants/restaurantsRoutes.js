"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /backend/src/modules/restaurants/restaurantsRoutes.ts
const express_1 = require("express");
const restaurantController_1 = require("./restaurantController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Rutas de restaurantes
router.get('/', restaurantController_1.getAllRestaurants); // Obtener todos los restaurantes (público)
router.get('/:id', restaurantController_1.getRestaurantById); // Obtener un restaurante por ID (público)
// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware_1.authMiddleware, restaurantController_1.createRestaurant); // Crear un nuevo restaurante
router.put('/:id', authMiddleware_1.authMiddleware, restaurantController_1.updateRestaurant); // Actualizar un restaurante
router.delete('/:id', authMiddleware_1.authMiddleware, restaurantController_1.deleteRestaurant); // Eliminar un restaurante
exports.default = router;
