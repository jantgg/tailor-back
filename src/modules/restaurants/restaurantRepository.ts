// /backend/src/modules/restaurants/restaurantRepository.ts
import { AppDataSource } from '../../data/AppDataSource';
import { Restaurant } from './Restaurant';

export const restaurantRepository = AppDataSource.getRepository(Restaurant).extend({
  findAllWithReviews() {
    return this.find({ relations: ['reviews'] });
  },

  findByIdWithReviews(id: string) {
    return this.findOne({ where: { id }, relations: ['reviews'] });
  },

  async createRestaurant(data: Partial<Restaurant>) {
    const restaurant = this.create(data);
    return await this.save(restaurant);
  },

  async updateRestaurant(id: string, data: Partial<Restaurant>) {
    await this.update(id, data);
    return this.findOne({ where: { id }, relations: ['reviews'] });
  },

  async deleteRestaurant(id: string) {
    return this.delete(id);
  }
});
