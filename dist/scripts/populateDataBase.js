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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /backend/src/scripts/populateDatabase.ts
const AppDataSource_1 = require("../data/AppDataSource");
const Restaurant_1 = require("../modules/restaurants/Restaurant");
const Review_1 = require("../modules/reviews/Review");
const User_1 = require("../modules/auth/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const restaurants_json_1 = __importDefault(require("../data/restaurants.json"));
function populateDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener los repositorios de las entidades
            const restaurantRepository = AppDataSource_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
            const reviewRepository = AppDataSource_1.AppDataSource.getRepository(Review_1.Review);
            const userRepository = AppDataSource_1.AppDataSource.getRepository(User_1.User);
            // Iterar sobre los restaurantes y agregar los datos a la base de datos
            for (const restaurant of restaurants_json_1.default.restaurants) {
                // Crear el objeto restaurante
                const newRestaurant = restaurantRepository.create({
                    name: restaurant.name,
                    neighborhood: restaurant.neighborhood,
                    photograph: restaurant.photograph,
                    address: restaurant.address,
                    latlng: restaurant.latlng,
                    image: restaurant.image,
                    cuisine_type: restaurant.cuisine_type,
                    operating_hours: restaurant.operating_hours,
                });
                // Guardar el restaurante en la base de datos
                const savedRestaurant = yield restaurantRepository.save(newRestaurant);
                // Iterar sobre las reviews y agregar cada una
                for (const review of restaurant.reviews) {
                    // Para simplificar, vamos a crear un usuario genérico si no existe
                    let user = yield userRepository.findOne({ where: { username: review.name } });
                    if (!user) {
                        const hashedPassword = bcryptjs_1.default.hashSync("password123", 10); // Encriptar la contraseña de manera sincrónica
                        user = userRepository.create({
                            username: review.name,
                            password: hashedPassword, // Contraseña encriptada
                        });
                        user = yield userRepository.save(user);
                    }
                    // Crear la review
                    const newReview = reviewRepository.create({
                        name: review.name,
                        rating: review.rating,
                        comments: review.comments,
                        user: user,
                        restaurant: savedRestaurant,
                    });
                    // Guardar la review en la base de datos
                    yield reviewRepository.save(newReview);
                }
            }
            console.log("Datos insertados correctamente");
        }
        catch (error) {
            console.error("Error al insertar los datos: ", error);
        }
    });
}
AppDataSource_1.AppDataSource.initialize()
    .then(() => {
    populateDatabase();
})
    .catch((error) => console.error("Error al inicializar la fuente de datos: ", error));
