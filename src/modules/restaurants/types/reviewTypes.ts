// /backend/src/modules/restaurants/types/reviewTypes.ts
import { User } from '../../auth/types/usersTypes'; // Importación del tipo User
import { Restaurant } from './restaurantsTypes'; // Importación del tipo Restaurant

export interface Review {
  id: string;
  name: string;
  rating: number;
  comments: string;
  createdAt: Date;
  user: User;
  restaurant: Restaurant;
}
