// /backend/src/modules/auth/types/usersTypes.ts
import { Favorite } from '../../favorites/types/favoritesTypes';
import { Review } from '../../restaurants/types/reviewTypes';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  favorites: Favorite[];
  reviews: Review[];
}
