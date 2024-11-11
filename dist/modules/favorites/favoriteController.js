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
exports.removeFavorite = exports.addFavorite = exports.getFavoritesByUser = void 0;
const favoriteRepository_1 = require("./favoriteRepository");
const getFavoritesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const favorites = yield favoriteRepository_1.favoriteRepository.findAllByUser(userId);
        res.json(favorites);
    }
    catch (error) {
        console.error('Error al obtener los favoritos:', error);
        res.status(500).json({ message: 'Error al obtener los favoritos' });
    }
});
exports.getFavoritesByUser = getFavoritesByUser;
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const { restaurantId } = req.body;
        // Verifica si el favorito ya existe
        const existingFavorite = yield favoriteRepository_1.favoriteRepository.findByUserAndRestaurant(userId, restaurantId);
        if (existingFavorite) {
            res.status(400).json({ message: 'El restaurante ya está en los favoritos' });
            return;
        }
        // Crea el nuevo favorito
        const newFavorite = favoriteRepository_1.favoriteRepository.create({
            user: { id: userId },
            restaurant: { id: restaurantId },
        });
        yield favoriteRepository_1.favoriteRepository.save(newFavorite);
        res.status(201).json(newFavorite);
    }
    catch (error) {
        console.error('Error al agregar el favorito:', error);
        res.status(500).json({ message: 'Error al agregar el favorito' });
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const { restaurantId } = req.params;
        const favorite = yield favoriteRepository_1.favoriteRepository.findByUserAndRestaurant(userId, restaurantId);
        if (!favorite) {
            res.status(404).json({ message: 'Favorito no encontrado' });
            return;
        }
        yield favoriteRepository_1.favoriteRepository.remove(favorite);
        res.json({ message: 'Favorito eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el favorito:', error);
        res.status(500).json({ message: 'Error al eliminar el favorito' });
    }
});
exports.removeFavorite = removeFavorite;
