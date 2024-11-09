"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// /backend/src/data/AppDataSource.ts
const typeorm_1 = require("typeorm");
const Restaurant_1 = require("../modules/restaurants/entities/Restaurant");
const Review_1 = require("../modules/restaurants/entities/Review");
const Favorite_1 = require("../modules/favorites/entities/Favorite");
const User_1 = require("../modules/auth/entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Restaurant_1.Restaurant, Review_1.Review, Favorite_1.Favorite, User_1.User],
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
});
