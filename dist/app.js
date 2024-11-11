"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./modules/auth/authRoutes"));
const restaurantsRoutes_1 = __importDefault(require("./modules/restaurants/restaurantsRoutes"));
const favoritesRoutes_1 = __importDefault(require("./modules/favorites/favoritesRoutes"));
const reviewsRoutes_1 = __importDefault(require("./modules/reviews/reviewsRoutes"));
const app = (0, express_1.default)();
// Configura CORS para permitir solicitudes de todos los orígenes
app.use((0, cors_1.default)());
// O, para restringir a un dominio específico:
// app.use(cors({
//   origin: 'http://localhost:3000', // URL del cliente de Next.js
// }));
app.use(express_1.default.json());
// Rutas de autenticación
app.use('/api/auth', authRoutes_1.default);
// Rutas generadas con crudGenerator.ts
app.use('/api/restaurants', restaurantsRoutes_1.default);
app.use('/api/favorites', favoritesRoutes_1.default);
app.use('/api/reviews', reviewsRoutes_1.default);
exports.default = app;
