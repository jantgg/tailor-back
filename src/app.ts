import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/authRoutes';
import restaurantRoutes from './modules/restaurants/restaurantsRoutes';
import favoriteRoutes from './modules/favorites/favoritesRoutes';
import reviewRoutes from './modules/reviews/reviewsRoutes';

const app: Application = express();

// Configura CORS para permitir solicitudes de todos los orígenes
app.use(cors());

// O, para restringir a un dominio específico:
// app.use(cors({
//   origin: 'http://localhost:3000', // URL del cliente de Next.js
// }));

app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas generadas con crudGenerator.ts
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;
