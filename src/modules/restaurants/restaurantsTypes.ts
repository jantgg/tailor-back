// /backend/src/modules/restaurants/restaurantTypes.ts
import { User } from '../auth/usersTypes';
import { Favorite } from '../favorites/favoritesTypes';
import { Review } from '../reviews/reviewTypes';

interface LatLng {
  lat: number;
  lng: number;
}

interface OperatingHours {
  [day: string]: string;
}

export interface Restaurant {
  id: string;
  name: string;
  neighborhood: string;
  photograph: string;
  address: string;
  latlng: LatLng;
  image: string;
  cuisine_type: string;
  operating_hours: OperatingHours;
  createdAt: Date;
  updatedAt: Date;
  favorites: Favorite[];
  reviews: Review[];
}
