// /backend/src/utils/calculateRating.ts

import { Review } from '../modules/reviews/Review';

export const calculateRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round(totalRating / reviews.length); // Redondea a un número entero
};
