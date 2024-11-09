"use strict";
// src/utils/createRepositories.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteRepository = exports.reviewRepository = exports.restaurantRepository = void 0;
const AppDataSource_1 = require("../data/AppDataSource");
const Restaurant_1 = require("../modules/restaurants/entities/Restaurant");
const Review_1 = require("../modules/restaurants/entities/Review");
const Favorite_1 = require("../modules/favorites/entities/Favorite");
exports.restaurantRepository = AppDataSource_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
exports.reviewRepository = AppDataSource_1.AppDataSource.getRepository(Review_1.Review);
exports.favoriteRepository = AppDataSource_1.AppDataSource.getRepository(Favorite_1.Favorite);
