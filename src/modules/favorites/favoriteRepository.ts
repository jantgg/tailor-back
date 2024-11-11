// /backend/src/modules/favorites/favoriteRepository.ts
import { AppDataSource } from '../../data/AppDataSource';
import { Favorite } from './Favorite';

export const favoriteRepository = AppDataSource.getRepository(Favorite).extend({

  // Obtiene todos los favoritos de un usuario específico
  async findAllByUser(userId: string) {
    return this.find({
      where: { user: { id: userId } },
      relations: ['restaurant', 'user'], // Carga las relaciones necesarias
    });
  },

  // Verifica si un restaurante está en los favoritos de un usuario
  async findByUserAndRestaurant(userId: string, restaurantId: string) {
    return this.findOne({
      where: { user: { id: userId }, restaurant: { id: restaurantId } },
      relations: ['restaurant', 'user'],
    });
  }
});
