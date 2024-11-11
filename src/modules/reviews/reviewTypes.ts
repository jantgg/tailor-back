// /backend/src/modules/restaurants/reviewTypes.ts
import { User } from '../auth/usersTypes'; // Importación del tipo User
import { Restaurant } from '../restaurants/restaurantsTypes'; // Importación del tipo Restaurant

export interface Review {
  id: string;
  name: string;
  rating: number;
  comments: string;
  createdAt: Date;
  user: User;
  restaurant: Restaurant;
}
