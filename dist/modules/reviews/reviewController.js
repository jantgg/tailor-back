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
const AppDataSource_1 = require("../../data/AppDataSource");
const User_1 = require("../auth/User");
const Restaurant_1 = require("../restaurants/Restaurant");
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewRepository_1.reviewRepository.find();
        res.status(200).json(reviews);
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
        res.status(200).json(review);
    }
    catch (error) {
        console.error('Error al obtener reseña por ID:', error);
        res.status(500).json({ message: 'Error al obtener reseña por ID' });
    }
});
exports.getReviewById = getReviewById;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, comments, userId, restaurantId, name } = req.body;
        // Buscar usuario y restaurante por sus IDs
        const userRepository = AppDataSource_1.AppDataSource.getRepository(User_1.User);
        const restaurantRepository = AppDataSource_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
        const user = yield userRepository.findOne({ where: { id: userId } });
        const restaurant = yield restaurantRepository.findOne({ where: { id: restaurantId } });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        if (!restaurant) {
            res.status(404).json({ message: 'Restaurante no encontrado' });
            return;
        }
        const newReview = reviewRepository_1.reviewRepository.create({
            name,
            rating,
            comments,
            user,
            restaurant,
        });
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
        res.status(200).json(updatedReview);
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
        const review = yield reviewRepository_1.reviewRepository.findOne({ where: { id } });
        if (!review) {
            res.status(404).json({ message: 'Reseña no encontrada' });
            return;
        }
        yield reviewRepository_1.reviewRepository.delete(id);
        res.status(200).json({ message: 'Reseña eliminada correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar reseña:', error);
        res.status(500).json({ message: 'Error al eliminar reseña' });
    }
});
exports.deleteReview = deleteReview;
