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
exports.reviewRepository = void 0;
// /backend/src/modules/restaurants/reviewRepository.ts
const AppDataSource_1 = require("../../data/AppDataSource");
const Review_1 = require("./Review");
// Repositorio personalizado para Review
exports.reviewRepository = AppDataSource_1.AppDataSource.getRepository(Review_1.Review).extend({
    // Obtiene todas las reseñas de un restaurante específico
    findAllByRestaurant(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                where: { restaurant: { id: restaurantId } },
                relations: ['restaurant', 'user'], // Carga las relaciones necesarias
            });
        });
    },
    // Obtiene una reseña específica de un restaurante
    findByIdAndRestaurant(reviewId, restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                where: { id: reviewId, restaurant: { id: restaurantId } },
                relations: ['restaurant', 'user'], // Carga las relaciones necesarias
            });
        });
    },
});
