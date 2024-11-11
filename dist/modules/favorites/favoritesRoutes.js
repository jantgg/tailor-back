"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/favorites/favoritesRoutes.ts
const express_1 = require("express");
const favoriteController_1 = require("./favoriteController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, favoriteController_1.getFavoritesByUser); // Obtener los favoritos del usuario autenticado
router.post('/', authMiddleware_1.authMiddleware, favoriteController_1.addFavorite); // Agregar un restaurante a favoritos
router.delete('/:restaurantId', authMiddleware_1.authMiddleware, favoriteController_1.removeFavorite); // Eliminar un restaurante de favoritos
exports.default = router;
