import { Request, Response } from 'express';
import { reviewRepository } from './reviewRepository';
import { AppDataSource } from '../../data/AppDataSource';
import { User } from '../auth/User';
import { Restaurant } from '../restaurants/Restaurant';

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await reviewRepository.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await reviewRepository.findOne({ where: { id } });
    if (!review) {
      res.status(404).json({ message: 'Reseña no encontrada' });
      return;
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error al obtener reseña por ID:', error);
    res.status(500).json({ message: 'Error al obtener reseña por ID' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comments, userId, restaurantId, name } = req.body;

    // Buscar usuario y restaurante por sus IDs
    const userRepository = AppDataSource.getRepository(User);
    const restaurantRepository = AppDataSource.getRepository(Restaurant);

    const user = await userRepository.findOne({ where: { id: userId } });
    const restaurant = await restaurantRepository.findOne({ where: { id: restaurantId } });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (!restaurant) {
      res.status(404).json({ message: 'Restaurante no encontrado' });
      return;
    }

    const newReview = reviewRepository.create({
      name,
      rating,
      comments,
      user,
      restaurant,
    });

    await reviewRepository.save(newReview);
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ message: 'Error al crear reseña' });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const review = await reviewRepository.findOne({ where: { id } });

    if (!review) {
      res.status(404).json({ message: 'Reseña no encontrada' });
      return;
    }

    reviewRepository.merge(review, data);
    const updatedReview = await reviewRepository.save(review);

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    res.status(500).json({ message: 'Error al actualizar reseña' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await reviewRepository.findOne({ where: { id } });

    if (!review) {
      res.status(404).json({ message: 'Reseña no encontrada' });
      return;
    }

    await reviewRepository.delete(id);
    res.status(200).json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ message: 'Error al eliminar reseña' });
  }
};
