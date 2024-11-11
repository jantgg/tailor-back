// /backend/src/scripts/populateDatabase.ts
import { AppDataSource } from '../data/AppDataSource';
import { Restaurant } from "../modules/restaurants/Restaurant";
import { Review } from "../modules/reviews/Review";
import { User } from "../modules/auth/User";
import bcrypt from 'bcryptjs';

import restaurantData from "../data/restaurants.json";

async function populateDatabase() {
  try {
    // Obtener los repositorios de las entidades
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const reviewRepository = AppDataSource.getRepository(Review);
    const userRepository = AppDataSource.getRepository(User);

    // Iterar sobre los restaurantes y agregar los datos a la base de datos
    for (const restaurant of restaurantData.restaurants) {
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
      const savedRestaurant = await restaurantRepository.save(newRestaurant);

      // Iterar sobre las reviews y agregar cada una
      for (const review of restaurant.reviews) {
        // Para simplificar, vamos a crear un usuario genérico si no existe
        let user = await userRepository.findOne({ where: { username: review.name } });
        if (!user) {
          const hashedPassword = bcrypt.hashSync("password123", 10); // Encriptar la contraseña de manera sincrónica
          user = userRepository.create({
            username: review.name,
            password: hashedPassword, // Contraseña encriptada
          });
          user = await userRepository.save(user);
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
        await reviewRepository.save(newReview);
      }
    }

    console.log("Datos insertados correctamente");
  } catch (error) {
    console.error("Error al insertar los datos: ", error);
  }
}

AppDataSource.initialize()
  .then(() => {
    populateDatabase();
  })
  .catch((error) => console.error("Error al inicializar la fuente de datos: ", error));
