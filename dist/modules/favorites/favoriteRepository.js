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
exports.favoriteRepository = void 0;
// /backend/src/modules/favorites/favoriteRepository.ts
const AppDataSource_1 = require("../../data/AppDataSource");
const Favorite_1 = require("./Favorite");
exports.favoriteRepository = AppDataSource_1.AppDataSource.getRepository(Favorite_1.Favorite).extend({
    // Obtiene todos los favoritos de un usuario específico
    findAllByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                where: { user: { id: userId } },
                relations: ['restaurant', 'user'], // Carga las relaciones necesarias
            });
        });
    },
    // Verifica si un restaurante está en los favoritos de un usuario
    findByUserAndRestaurant(userId, restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                where: { user: { id: userId }, restaurant: { id: restaurantId } },
                relations: ['restaurant', 'user'],
            });
        });
    }
});
