"use strict";
// src/modules/favorites/routes/favoritesRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createRepositories_1 = require("../../../utils/createRepositories");
const crudGenerator_1 = require("../../../utils/crudGenerator");
const router = (0, express_1.Router)();
// Generar rutas CRUD para Favorite
router.use('/', (0, crudGenerator_1.generateCrudRoutes)({ repository: createRepositories_1.favoriteRepository, protected: true }));
exports.default = router;
