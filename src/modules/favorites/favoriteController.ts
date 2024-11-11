// /backend/src/modules/favorites/favoriteController.ts
import { Request, Response } from 'express';
import { favoriteRepository } from './favoriteRepository';

export const getFavoritesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // ID del usuario autenticado
    const favorites = await favoriteRepository.findAllByUser(userId);
    res.json(favorites);
  } catch (error) {
    console.error('Error al obtener los favoritos:', error);
    res.status(500).json({ message: 'Error al obtener los favoritos' });
  }
};

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // ID del usuario autenticado
    const { restaurantId } = req.body;

    // Verifica si el favorito ya existe
    const existingFavorite = await favoriteRepository.findByUserAndRestaurant(userId, restaurantId);
    if (existingFavorite) {
      res.status(400).json({ message: 'El restaurante ya está en los favoritos' });
      return;
    }

    // Crea el nuevo favorito
    const newFavorite = favoriteRepository.create({
      user: { id: userId },
      restaurant: { id: restaurantId },
    });
    await favoriteRepository.save(newFavorite);
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Error al agregar el favorito:', error);
    res.status(500).json({ message: 'Error al agregar el favorito' });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // ID del usuario autenticado
    const { restaurantId } = req.params;

    const favorite = await favoriteRepository.findByUserAndRestaurant(userId, restaurantId);
    if (!favorite) {
      res.status(404).json({ message: 'Favorito no encontrado' });
      return;
    }

    await favoriteRepository.remove(favorite);
    res.json({ message: 'Favorito eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el favorito:', error);
    res.status(500).json({ message: 'Error al eliminar el favorito' });
  }
};
