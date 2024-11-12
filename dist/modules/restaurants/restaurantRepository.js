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
exports.restaurantRepository = void 0;
// /backend/src/modules/restaurants/restaurantRepository.ts
const AppDataSource_1 = require("../../data/AppDataSource");
const Restaurant_1 = require("./Restaurant");
exports.restaurantRepository = AppDataSource_1.AppDataSource.getRepository(Restaurant_1.Restaurant).extend({
    findAllWithReviews() {
        return this.find({ relations: ['reviews', 'reviews.user'] });
    },
    findByIdWithReviews(id) {
        return this.findOne({
            where: { id },
            relations: ['reviews', 'reviews.user'], // Incluye el usuario en cada review
            select: {
                reviews: {
                    id: true,
                    name: true,
                    rating: true,
                    comments: true,
                    createdAt: true,
                    user: {
                        id: true,
                        username: true, // Solo selecciona id y username del usuario
                    },
                },
            },
        });
    },
    createRestaurant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = this.create(data);
            return yield this.save(restaurant);
        });
    },
    updateRestaurant(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update(id, data);
            return this.findOne({
                where: { id },
                relations: ['reviews', 'reviews.user'],
            });
        });
    },
    deleteRestaurant(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delete(id);
        });
    }
});
