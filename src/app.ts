// src/app.ts

import express, { Application } from 'express';
import authRoutes from './modules/auth/routes/authRoutes';
import restaurantRoutes from './modules/restaurants/routes/restaurantsRoutes';
import favoriteRoutes from './modules/favorites/routes/favoritesRoutes'; 
import reviewRoutes from './modules/restaurants/routes/reviewsRoutes'; 

const app: Application = express();
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas generadas con crudGenerator.ts
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes); 

export default app;
