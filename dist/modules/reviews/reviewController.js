"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviewById = exports.getAllReviews = void 0;
const reviewRepository_1 = require("./reviewRepository");
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewRepository_1.reviewRepository.find();
        res.json(reviews);
    }
    catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ message: 'Error al obtener reseñas' });
    }
});
exports.getAllReviews = getAllReviews;
const getReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const review = yield reviewRepository_1.reviewRepository.findOne({ where: { id } });
        if (!review) {
            res.status(404).json({ message: 'Reseña no encontrada' });
            return;
        }
        res.json(review);
    }
    catch (error) {
        console.error('Error al obtener reseña por ID:', error);
        res.status(500).json({ message: 'Error al obtener reseña por ID' });
    }
});
exports.getReviewById = getReviewById;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newReview = reviewRepository_1.reviewRepository.create(data);
        yield reviewRepository_1.reviewRepository.save(newReview);
        res.status(201).json(newReview);
    }
    catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ message: 'Error al crear reseña' });
    }
});
exports.createReview = createReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const review = yield reviewRepository_1.reviewRepository.findOne({ where: { id } });
        if (!review) {
            res.status(404).json({ message: 'Reseña no encontrada' });
            return;
        }
        reviewRepository_1.reviewRepository.merge(review, data);
        const updatedReview = yield reviewRepository_1.reviewRepository.save(review);
        res.json(updatedReview);
    }
    catch (error) {
        console.error('Error al actualizar reseña:', error);
        res.status(500).json({ message: 'Error al actualizar reseña' });
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield reviewRepository_1.reviewRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: 'Reseña no encontrada' });
            return;
        }
        res.json({ message: 'Reseña eliminada correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar reseña:', error);
        res.status(500).json({ message: 'Error al eliminar reseña' });
    }
});
exports.deleteReview = deleteReview;
