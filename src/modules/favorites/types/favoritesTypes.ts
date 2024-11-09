// /backend/src/modules/favorites/types/favoriteTypes.ts
import { User } from '../../auth/types/usersTypes';
import { Restaurant } from '../../restaurants/types/restaurantsTypes';

export interface Favorite {
  id: string;
  user: User;
  restaurant: Restaurant;
  createdAt: Date;
}
