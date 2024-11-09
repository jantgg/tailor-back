// /backend/__tests__/reviewsRoutes.test.ts

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

    // Crear un restaurante de prueba para asociar las reseñas
    const restaurantResponse = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Restaurant for Reviews',
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

describe('Review CRUD Endpoints', () => {
  // Prueba para crear una reseña
  describe('POST /api/reviews', () => {
    it('debería crear una nueva reseña exitosamente', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Review',
          rating: 5,
          comments: 'This is a test review.',
          restaurant: createdRestaurantId,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  // Prueba para obtener una reseña por ID
  describe('GET /api/reviews/:id', () => {
    it('debería devolver una reseña por ID', async () => {
      // Crear una reseña temporal para la prueba
      const createRes = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Temporary Review',
          rating: 4,
          comments: 'This is a temporary review.',
          restaurant: createdRestaurantId,
        });
      const createdReviewId = createRes.body.id;

      const res = await request(app)
        .get(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', createdReviewId);
    });

    it('debería devolver un error si la reseña no existe', async () => {
      const res = await request(app)
        .get('/api/reviews/12345678')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });

  // Prueba para actualizar una reseña por ID
  describe('PUT /api/reviews/:id', () => {
    it('debería actualizar una reseña exitosamente', async () => {
      // Crear una reseña temporal para la prueba de actualización
      const createRes = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Review to Update',
          rating: 3,
          comments: 'This is a review to be updated.',
          restaurant: createdRestaurantId,
        });
      const createdReviewId = createRes.body.id;

      const res = await request(app)
        .put(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          rating: 4,
          comments: 'This is an updated review.',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('rating', 4);
      expect(res.body).toHaveProperty('comments', 'This is an updated review.');
    });

    it('debería devolver un error si la reseña no existe', async () => {
      const res = await request(app)
        .put('/api/reviews/12345678')
        .set('Authorization', `Bearer ${token}`)
        .send({
          rating: 3,
          comments: 'Non-existent review update.',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });

  // Prueba para eliminar una reseña por ID
  describe('DELETE /api/reviews/:id', () => {
    it('debería eliminar una reseña exitosamente', async () => {
      // Crear una reseña temporal para la prueba de eliminación
      const createRes = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Review to Delete',
          rating: 2,
          comments: 'This is a review to be deleted.',
          restaurant: createdRestaurantId,
        });
      const createdReviewId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Entity deleted successfully');
    });

    it('debería devolver un error si la reseña no existe', async () => {
      const res = await request(app)
        .delete('/api/reviews/12345678')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });
});
