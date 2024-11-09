"use strict";
// src/modules/restaurants/routes/restaurantsRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createRepositories_1 = require("../../../utils/createRepositories");
const crudGenerator_1 = require("../../../utils/crudGenerator");
const router = (0, express_1.Router)();
// Generar rutas CRUD para Restaurant
router.use('/', (0, crudGenerator_1.generateCrudRoutes)({ repository: createRepositories_1.restaurantRepository, protected: true }));
exports.default = router;
