// /backend/src/modules/restaurants/restaurantController.ts
import { Request, Response } from 'express';
import { restaurantRepository } from './restaurantRepository';
import { calculateRating } from '../../utils/calculateRating';

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await restaurantRepository.findAllWithReviews();

    // Calcular el rating promedio para cada restaurante
    const restaurantsWithRating = restaurants.map(restaurant => ({
      ...restaurant,
      averageRating: calculateRating(restaurant.reviews),
    }));

    res.json(restaurantsWithRating);
  } catch (error) {
    console.error('Error al obtener restaurantes:', error);
    res.status(500).json({ message: 'Error al obtener restaurantes' });
  }
};

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Buscando restaurante con ID: ${id}`);
    const restaurant = await restaurantRepository.findByIdWithReviews(id);

    if (!restaurant) {
      console.log(`Restaurante con ID ${id} no encontrado`);
      res.status(404).json({ message: 'Restaurante no encontrado' });
      return;
    }

    console.log(`Restaurante encontrado: ${restaurant.name}`);
    const restaurantWithRating = {
      ...restaurant,
      averageRating: calculateRating(restaurant.reviews),
    };

    res.status(200).json(restaurantWithRating);  // Añadir el estado explícito 200
  } catch (error) {
    console.error('Error al obtener restaurante por ID:', error);
    res.status(500).json({ message: 'Error al obtener restaurante por ID' });
  }
};


export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, image } = req.body;

    // Valores estáticos ya que el formulario en front está incompleto
    const newRestaurant = await restaurantRepository.createRestaurant({
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
  } catch (error) {
    console.error('Error al crear restaurante:', error);
    res.status(500).json({ message: 'Error al crear restaurante' });
  }
};


export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(`Actualizando restaurante con ID: ${id}`);
    const updatedRestaurant = await restaurantRepository.updateRestaurant(id, data);

    if (!updatedRestaurant) {
      console.log(`Restaurante con ID ${id} no encontrado para actualizar`);
      res.status(404).json({ message: 'Restaurante no encontrado' });
      return;
    }

    console.log(`Restaurante actualizado: ${updatedRestaurant.name}`);
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error('Error al actualizar restaurante:', error);
    res.status(500).json({ message: 'Error al actualizar restaurante' });
  }
};


export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Eliminando restaurante con ID: ${id}`);
    const result = await restaurantRepository.deleteRestaurant(id);

    if (result.affected === 0) {
      console.log(`Restaurante con ID ${id} no encontrado para eliminar`);
      res.status(404).json({ message: 'Restaurante no encontrado' });
      return;
    }

    console.log(`Restaurante con ID ${id} eliminado correctamente`);
    res.status(200).json({ message: 'Restaurante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar restaurante:', error);
    res.status(500).json({ message: 'Error al eliminar restaurante' });
  }
};

