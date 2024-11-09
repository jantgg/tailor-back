"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./modules/auth/routes/authRoutes"));
const restaurantsRoutes_1 = __importDefault(require("./modules/restaurants/routes/restaurantsRoutes"));
const favoritesRoutes_1 = __importDefault(require("./modules/favorites/routes/favoritesRoutes"));
const reviewsRoutes_1 = __importDefault(require("./modules/restaurants/routes/reviewsRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Rutas de autenticación
app.use('/api/auth', authRoutes_1.default);
// Rutas generadas con crudGenerator.ts
app.use('/api/restaurants', restaurantsRoutes_1.default);
app.use('/api/favorites', favoritesRoutes_1.default);
app.use('/api/reviews', reviewsRoutes_1.default);
exports.default = app;
