// /backend/src/modules/auth/usersTypes.ts
import { Favorite } from '../favorites/favoritesTypes';
import { Review } from '../reviews/reviewTypes';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  favorites: Favorite[];
  reviews: Review[];
}
