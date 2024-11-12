// /backend/src/modules/restaurants/restaurantRepository.ts
import { AppDataSource } from '../../data/AppDataSource';
import { Restaurant } from './Restaurant';

export const restaurantRepository = AppDataSource.getRepository(Restaurant).extend({
  findAllWithReviews() {
    return this.find({ relations: ['reviews', 'reviews.user'] });
  },

  findByIdWithReviews(id: string) {
    return this.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'], // Incluye el usuario en cada review
      select: {
        reviews: {
          id: true,
          name: true,
          rating: true,
          comments: true,
          createdAt: true,
          user: {
            id: true,
            username: true, // Solo selecciona id y username del usuario
          },
        },
      },
    });
  },
  
  async createRestaurant(data: Partial<Restaurant>) {
    const restaurant = this.create(data);
    return await this.save(restaurant);
  },

  async updateRestaurant(id: string, data: Partial<Restaurant>) {
    await this.update(id, data);
    return this.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
    });
  },

  async deleteRestaurant(id: string) {
    return this.delete(id);
  }
});

