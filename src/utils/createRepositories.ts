// src/utils/createRepositories.ts

import { AppDataSource } from '../data/AppDataSource';
import { Restaurant } from '../modules/restaurants/entities/Restaurant';
import { Review } from '../modules/restaurants/entities/Review';
import { Favorite } from '../modules/favorites/entities/Favorite';

export const restaurantRepository = AppDataSource.getRepository(Restaurant);
export const reviewRepository = AppDataSource.getRepository(Review);
export const favoriteRepository = AppDataSource.getRepository(Favorite);
