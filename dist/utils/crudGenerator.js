"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCrudRoutes = generateCrudRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
function generateCrudRoutes({ repository, protected: isProtected }) {
    const router = (0, express_1.Router)();
    const applyAuthMiddleware = isProtected ? authMiddleware_1.authMiddleware : (_req, _res, next) => next();
    // Crear (POST)
    router.post('/', applyAuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newEntity = repository.create(req.body);
            const result = yield repository.save(newEntity);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    // Leer todos (GET)
    router.get('/', applyAuthMiddleware, (_req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const entities = yield repository.find();
            res.json(entities);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }));
    // Leer uno por ID (GET)
    router.get('/:id', applyAuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const entityFound = yield repository.findOne({
                where: { id } // Conversión de tipo adicional
            });
            if (!entityFound) {
                res.status(404).json({ message: 'Entity not found' });
                return;
            }
            res.json(entityFound);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }));
    // Actualizar (PUT)
    router.put('/:id', applyAuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const entityToUpdate = yield repository.findOne({
                where: { id }
            });
            if (!entityToUpdate) {
                res.status(404).json({ message: 'Entity not found' });
                return;
            }
            repository.merge(entityToUpdate, req.body);
            const result = yield repository.save(entityToUpdate);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    // Eliminar (DELETE)
    router.delete('/:id', applyAuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield repository.delete(req.params.id);
            if (result.affected === 0) {
                res.status(404).json({ message: 'Entity not found' });
                return;
            }
            res.json({ message: 'Entity deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }));
    return router;
}
