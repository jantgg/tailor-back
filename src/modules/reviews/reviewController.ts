// /backend/src/modules/restaurants/reviewController.ts
import { Request, Response } from 'express';
import { reviewRepository } from './reviewRepository';

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await reviewRepository.find();
    res.json(reviews);
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
    res.json(review);
  } catch (error) {
    console.error('Error al obtener reseña por ID:', error);
    res.status(500).json({ message: 'Error al obtener reseña por ID' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const newReview = reviewRepository.create(data);
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
    res.json(updatedReview);
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    res.status(500).json({ message: 'Error al actualizar reseña' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await reviewRepository.delete(id);
    if (result.affected === 0) {
      res.status(404).json({ message: 'Reseña no encontrada' });
      return;
    }
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ message: 'Error al eliminar reseña' });
  }
};
