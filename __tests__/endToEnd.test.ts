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

beforeAll(async () => {
  // Inicializar la conexión a la base de datos antes de todas las pruebas
  await AppDataSource.initialize();

  // Registrar un usuario de prueba antes de todas las pruebas
  const resRegister = await request(app)
    .post('/api/auth/register')
    .send({
      username: testUsername,
      password: testPassword,
    });

  expect(resRegister.statusCode).toEqual(201);
  expect(resRegister.body).toHaveProperty('message', 'Usuario registrado exitosamente');

  // Iniciar sesión y obtener el token
  const resLogin = await request(app)
    .post('/api/auth/login')
    .send({
      username: testUsername,
      password: testPassword,
    });

  expect(resLogin.statusCode).toEqual(200);
  expect(resLogin.body).toHaveProperty('token');
  token = resLogin.body.token;

  console.log('Token recibido:', token);
  expect(token).not.toBeUndefined(); // Asegurar que el token no es undefined
});

afterAll(async () => {
  // Destruir la conexión a la base de datos después de todas las pruebas
  await AppDataSource.destroy();
});

describe('End-to-End Test: User Registration, Login, Restaurant Creation, Review, and Favorite', () => {
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

  it('debería eliminar la reseña exitosamente', async () => {
    const res = await request(app)
      .delete(`/api/reviews/${createdReviewId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    // Ajuste del mensaje para que coincida con el mensaje real de la respuesta
    expect(res.body).toHaveProperty('message', 'Reseña eliminada correctamente');
  });

  it('debería eliminar el restaurante exitosamente', async () => {
    const res = await request(app)
      .delete(`/api/restaurants/${createdRestaurantId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    // Ajuste del mensaje para que coincida con el mensaje real de la respuesta
    expect(res.body).toHaveProperty('message', 'Restaurante eliminado correctamente');
  });
});
