// /backend/src/data/AppDataSource.ts
import { DataSource } from 'typeorm';
import { Restaurant } from '../modules/restaurants/Restaurant';
import { Review } from '../modules/reviews/Review';
import { Favorite } from '../modules/favorites/Favorite';
import { User } from '../modules/auth/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Restaurant, Review, Favorite, User],
  synchronize: false,
  migrations: ['dist/migrations/*.js'], // Cambia a .js para los archivos transpilados
});
