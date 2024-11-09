// /backend/src/modules/restaurants/types/restaurantTypes.ts
import { User } from '../../auth/types/usersTypes';
import { Favorite } from '../../favorites/types/favoritesTypes';
import { Review } from './reviewTypes';

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
