// /backend/src/data/AppDataSource.ts
import { DataSource } from 'typeorm';
import { Restaurant } from '../modules/restaurants/entities/Restaurant';
import { Review } from '../modules/restaurants/entities/Review';
import { Favorite } from '../modules/favorites/entities/Favorite';
import { User } from '../modules/auth/entities/User';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Restaurant, Review, Favorite, User],
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
  });
  