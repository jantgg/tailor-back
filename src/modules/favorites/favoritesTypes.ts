// /backend/src/modules/favorites/favoriteTypes.ts
import { User } from '../auth/usersTypes';
import { Restaurant } from '../restaurants/restaurantsTypes';

export interface Favorite {
  id: string;
  user: User;
  restaurant: Restaurant;
  createdAt: Date;
}
