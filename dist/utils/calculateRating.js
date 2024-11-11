"use strict";
// /backend/src/utils/calculateRating.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRating = void 0;
const calculateRating = (reviews) => {
    if (reviews.length === 0)
        return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(totalRating / reviews.length); // Redondea a un número entero
};
exports.calculateRating = calculateRating;
