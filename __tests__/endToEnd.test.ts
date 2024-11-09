// /backend/__tests__/endToEnd.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data/AppDataSource';

// Configuración de usuarios de prueba
const testUsername = `test-user-${Date.now()}`;
const testPassword = 'test-password';

let token: string;
let createdRestaurantId: string;
let createdReviewId: string;
let createdFavoriteId: string;
let queryRunner: any;

beforeAll(async () => {
  // Inicializar la conexión a la base de datos antes de todas las pruebas
  await AppDataSource.initialize();
  
  // Iniciar una transacción antes de todas las pruebas
  queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
});

afterAll(async () => {
  // Revertir la transacción después de todas las pruebas para mantener la base de datos limpia
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
  await AppDataSource.destroy();
});

describe('End-to-End Test: User Registration, Login, Restaurant Creation, Review, and Favorite', () => {
  it('debería registrar un nuevo usuario exitosamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: testUsername,
        password: testPassword,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
  });

  it('debería permitir al usuario iniciar sesión exitosamente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUsername,
        password: testPassword,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('debería crear un nuevo restaurante exitosamente', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'End-to-End Test Restaurant',
        neighborhood: 'Test Neighborhood',
        photograph: 'test.jpg',
        address: '123 Test St',
        latlng: { lat: 40.7128, lng: -74.0060 },
        image: 'test.jpg',
        cuisine_type: 'Italian',
        operating_hours: { Monday: '9:00 am - 10:00 pm' },
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdRestaurantId = res.body.id;
  });

  it('debería añadir una reseña al restaurante exitosamente', async () => {
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
    createdReviewId = res.body.id;
  });

  it('debería añadir el restaurante a favoritos exitosamente', async () => {
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurant: createdRestaurantId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdFavoriteId = res.body.id;
  });

  it('debería eliminar el favorito exitosamente', async () => {
    const res = await request(app)
      .delete(`/api/favorites/${createdFavoriteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Entity deleted successfully');
  });

  it('debería eliminar la reseña exitosamente', async () => {
    const res = await request(app)
      .delete(`/api/reviews/${createdReviewId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Entity deleted successfully');
  });

  it('debería eliminar el restaurante exitosamente', async () => {
    const res = await request(app)
      .delete(`/api/restaurants/${createdRestaurantId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Entity deleted successfully');
  });
});
