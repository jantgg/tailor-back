"use strict";
// src/modules/reviews/routes/reviewsRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createRepositories_1 = require("../../../utils/createRepositories");
const crudGenerator_1 = require("../../../utils/crudGenerator");
const router = (0, express_1.Router)();
// Generar rutas CRUD para Review
router.use('/', (0, crudGenerator_1.generateCrudRoutes)({ repository: createRepositories_1.reviewRepository, protected: true }));
exports.default = router;
