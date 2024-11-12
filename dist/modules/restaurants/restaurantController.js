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
exports.deleteRestaurant = exports.updateRestaurant = exports.createRestaurant = exports.getRestaurantById = exports.getAllRestaurants = void 0;
const restaurantRepository_1 = require("./restaurantRepository");
const calculateRating_1 = require("../../utils/calculateRating");
const getAllRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurantRepository_1.restaurantRepository.findAllWithReviews();
        // Calcular el rating promedio para cada restaurante
        const restaurantsWithRating = restaurants.map(restaurant => (Object.assign(Object.assign({}, restaurant), { averageRating: (0, calculateRating_1.calculateRating)(restaurant.reviews) })));
        res.json(restaurantsWithRating);
    }
    catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ message: 'Error al obtener restaurantes' });
    }
});
exports.getAllRestaurants = getAllRestaurants;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restaurant = yield restaurantRepository_1.restaurantRepository.findByIdWithReviews(id);
        if (!restaurant) {
            res.status(404).json({ message: 'Restaurante no encontrado' });
            return;
        }
        // Calcular el rating promedio para el restaurante
        const restaurantWithRating = Object.assign(Object.assign({}, restaurant), { averageRating: (0, calculateRating_1.calculateRating)(restaurant.reviews) });
        res.json(restaurantWithRating);
    }
    catch (error) {
        console.error('Error al obtener restaurante por ID:', error);
        res.status(500).json({ message: 'Error al obtener restaurante por ID' });
    }
});
exports.getRestaurantById = getRestaurantById;
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, image } = req.body;
        // Valores estáticos ya que el formulario en front está incompleto
        const newRestaurant = yield restaurantRepository_1.restaurantRepository.createRestaurant({
            name,
            address,
            image,
            neighborhood: "Default Neighborhood",
            photograph: "default.jpg",
            cuisine_type: "International",
            latlng: { lat: 0, lng: 0 },
            operating_hours: {
                Monday: "9:00 AM - 5:00 PM",
                Tuesday: "9:00 AM - 5:00 PM",
                Wednesday: "9:00 AM - 5:00 PM",
                Thursday: "9:00 AM - 5:00 PM",
                Friday: "9:00 AM - 5:00 PM",
                Saturday: "Closed",
                Sunday: "Closed"
            }
        });
        res.status(201).json(newRestaurant);
    }
    catch (error) {
        console.error('Error al crear restaurante:', error);
        res.status(500).json({ message: 'Error al crear restaurante' });
    }
});
exports.createRestaurant = createRestaurant;
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedRestaurant = yield restaurantRepository_1.restaurantRepository.updateRestaurant(id, data);
        if (!updatedRestaurant) {
            res.status(404).json({ message: 'Restaurante no encontrado' });
            return;
        }
        res.json(updatedRestaurant);
    }
    catch (error) {
        console.error('Error al actualizar restaurante:', error);
        res.status(500).json({ message: 'Error al actualizar restaurante' });
    }
});
exports.updateRestaurant = updateRestaurant;
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield restaurantRepository_1.restaurantRepository.deleteRestaurant(id);
        if (result.affected === 0) {
            res.status(404).json({ message: 'Restaurante no encontrado' });
            return;
        }
        res.json({ message: 'Restaurante eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar restaurante:', error);
        res.status(500).json({ message: 'Error al eliminar restaurante' });
    }
});
exports.deleteRestaurant = deleteRestaurant;
