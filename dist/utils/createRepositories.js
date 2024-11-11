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
exports.restaurantRepository = exports.favoriteRepository = exports.reviewRepository = void 0;
exports.findRestaurantsWithReviews = findRestaurantsWithReviews;
exports.findRestaurantByIdWithReviews = findRestaurantByIdWithReviews;
// src/utils/createRepositories.ts
const AppDataSource_1 = require("../data/AppDataSource");
const Restaurant_1 = require("../modules/restaurants/Restaurant");
const Review_1 = require("../modules/reviews/Review");
const Favorite_1 = require("../modules/favorites/Favorite");
exports.reviewRepository = AppDataSource_1.AppDataSource.getRepository(Review_1.Review);
exports.favoriteRepository = AppDataSource_1.AppDataSource.getRepository(Favorite_1.Favorite);
// Definir consultas personalizadas para cargar relaciones sin extender el repositorio
exports.restaurantRepository = AppDataSource_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
// Función para encontrar todos los restaurantes con reseñas
function findRestaurantsWithReviews(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.restaurantRepository.find(Object.assign(Object.assign({}, options), { relations: ['reviews'] }));
    });
}
// Función para encontrar un restaurante por ID con reseñas
function findRestaurantByIdWithReviews(id, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.restaurantRepository.findOne(Object.assign(Object.assign({ where: { id } }, options), { relations: ['reviews'] }));
    });
}
