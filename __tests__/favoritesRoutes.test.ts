// /backend/__tests__/favoritesRoutes.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data/AppDataSource';
import { User } from '../src/modules/auth/entities/User';
import { Restaurant } from '../src/modules/restaurants/entities/Restaurant';

// Configuración de usuarios y restaurantes de prueba
const testUsername = process.env.TEST_USER_USERNAME || 'test-user';
const testPassword = process.env.TEST_USER_PASSWORD || 'test-password';

let token: string;
let createdRestaurantId: string;
let queryRunner: any;

beforeAll(async () => {
  // Inicializar la conexión a la base de datos antes de todas las pruebas
  await AppDataSource.initialize();

  // Iniciar una transacción antes de crear el restaurante de prueba
  queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // Verificar si el usuario de prueba ya existe en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ username: testUsername });

    if (!user) {
      // Registrar al usuario de prueba si no existe
      await request(app)
        .post('/api/auth/register')
        .send({
          username: testUsername,
          password: testPassword,
        });
    }

    // Autenticar al usuario de prueba para obtener el token de acceso
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUsername,
        password: testPassword,
      });

    token = loginResponse.body.token;

    // Crear un restaurante de prueba para asociar los favoritos
    const restaurantResponse = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Restaurant for Favorites',
        neighborhood: 'Test Neighborhood',
        photograph: 'test.jpg',
        address: '123 Test St',
        latlng: { lat: 40.7128, lng: -74.0060 },
        image: 'test.jpg',
        cuisine_type: 'Italian',
        operating_hours: { Monday: '9:00 am - 10:00 pm' },
      });

    createdRestaurantId = restaurantResponse.body.id;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  }
});

beforeEach(async () => {
  // Iniciar una transacción antes de cada prueba
  await queryRunner.startTransaction();
});

afterEach(async () => {
  // Revertir la transacción después de cada prueba para mantener la base de datos limpia
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
});

afterAll(async () => {
  // Revertir la transacción del restaurante de prueba y cerrar la conexión a la base de datos después de todas las pruebas
  await queryRunner.rollbackTransaction();
  await AppDataSource.destroy();
});

describe('Favorite CRUD Endpoints', () => {
  // Prueba para crear un favorito
  describe('POST /api/favorites', () => {
    it('debería crear un nuevo favorito exitosamente', async () => {
      const res = await request(app)
        .post('/api/favorites')
        .set('Authorization', `Bearer ${token}`)
        .send({
          restaurant: createdRestaurantId,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  // Prueba para obtener un favorito por ID
  describe('GET /api/favorites/:id', () => {
    it('debería devolver un favorito por ID', async () => {
      // Crear un favorito temporal para la prueba
      const createRes = await request(app)
        .post('/api/favorites')
        .set('Authorization', `Bearer ${token}`)
        .send({
          restaurant: createdRestaurantId,
        });
      const createdFavoriteId = createRes.body.id;

      const res = await request(app)
        .get(`/api/favorites/${createdFavoriteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', createdFavoriteId);
    });

    it('debería devolver un error si el favorito no existe', async () => {
      const res = await request(app)
        .get('/api/favorites/12345678')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });

  // Prueba para eliminar un favorito por ID
  describe('DELETE /api/favorites/:id', () => {
    it('debería eliminar un favorito exitosamente', async () => {
      // Crear un favorito temporal para la prueba de eliminación
      const createRes = await request(app)
        .post('/api/favorites')
        .set('Authorization', `Bearer ${token}`)
        .send({
          restaurant: createdRestaurantId,
        });
      const createdFavoriteId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/favorites/${createdFavoriteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Entity deleted successfully');
    });

    it('debería devolver un error si el favorito no existe', async () => {
      const res = await request(app)
        .delete('/api/favorites/12345678')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });
});
