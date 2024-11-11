// /backend/src/modules/restaurants/reviewRepository.ts
import { AppDataSource } from '../../data/AppDataSource';
import { Review } from './Review';

// Repositorio personalizado para Review
export const reviewRepository = AppDataSource.getRepository(Review).extend({
  
  // Obtiene todas las reseñas de un restaurante específico
  async findAllByRestaurant(restaurantId: string) {
    return this.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['restaurant', 'user'], // Carga las relaciones necesarias
    });
  },

  // Obtiene una reseña específica de un restaurante
  async findByIdAndRestaurant(reviewId: string, restaurantId: string) {
    return this.findOne({
      where: { id: reviewId, restaurant: { id: restaurantId } },
      relations: ['restaurant', 'user'], // Carga las relaciones necesarias
    });
  },
});
