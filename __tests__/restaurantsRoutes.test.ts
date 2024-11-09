// /backend/__tests__/restaurantsRoutes.test.ts

// Este archivo contiene un conjunto de pruebas para validar los endpoints CRUD de los restaurantes.
// Las pruebas están envueltas en transacciones, las cuales se revierten al finalizar cada prueba,
// asegurando que la base de datos se mantenga limpia y consistente sin registros de prueba persistentes.

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data/AppDataSource';
import { User } from '../src/modules/auth/entities/User';

const testUsername = process.env.TEST_USER_USERNAME || 'test-user';
const testPassword = process.env.TEST_USER_PASSWORD || 'test-password';

// Configurar las pruebas
let token: string;
let queryRunner: any;

beforeAll(async () => {
  // Inicializar la conexión a la base de datos antes de todas las pruebas
  await AppDataSource.initialize();

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
});

beforeEach(async () => {
  // Iniciar una transacción antes de cada prueba
  queryRunner = AppDataSource.createQueryRunner() as any;
  await queryRunner.startTransaction();
});

afterEach(async () => {
  // Revertir la transacción después de cada prueba para mantener la base de datos limpia
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
});

afterAll(async () => {
  // Cerrar la conexión a la base de datos después de todas las pruebas
  await AppDataSource.destroy();
});

// Este archivo contiene pruebas para los endpoints CRUD de Restaurantes.
// Las pruebas incluyen la creación, obtención, actualización y eliminación de restaurantes.
// Cada prueba está envuelta en una transacción para garantizar la integridad de la base de datos.

describe('Restaurant CRUD Endpoints', () => {
  // Eliminar dependencia compartida de ID del restaurante para mantener independencia entre pruebas

  // Prueba para crear un restaurante
  describe('POST /api/restaurants', () => {
    it('debería crear un nuevo restaurante exitosamente', async () => {
      // Crear un nuevo restaurante y verificar que se creó correctamente
      const res = await request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Restaurant',
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

      // Asignar el ID del restaurante creado para usarlo en pruebas posteriores
      // La variable 'createdRestaurantId' fue eliminada para mantener las pruebas independientes
    });
  });

  // Prueba para obtener un restaurante por ID
  describe('GET /api/restaurants/:id', () => {
    it('debería devolver un restaurante por ID', async () => {
      // Crear un restaurante temporal para la prueba
      const createRes = await request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Temporary Restaurant',
          neighborhood: 'Temporary Neighborhood',
          photograph: 'temp.jpg',
          address: '456 Temp St',
          latlng: { lat: 40.7128, lng: -74.0060 },
          image: 'temp.jpg',
          cuisine_type: 'French',
          operating_hours: { Monday: '10:00 am - 11:00 pm' },
        });
      const createdRestaurantId = createRes.body.id;
// Obtener el restaurante por ID y verificar que exista
      const res = await request(app)
        .get(`/api/restaurants/${createdRestaurantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', createdRestaurantId);
    });

    it('debería devolver un error si el restaurante no existe', async () => {
      // Intentar obtener un restaurante inexistente y verificar que devuelva un error 404
      const res = await request(app)
        .get('/api/restaurants/12345678')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });

  // Prueba para actualizar un restaurante por ID
  describe('PUT /api/restaurants/:id', () => {
    it('debería actualizar un restaurante exitosamente', async () => {
      // Crear un restaurante temporal para la prueba de actualización
      const createRes = await request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Restaurant to Update',
          neighborhood: 'Update Neighborhood',
          photograph: 'update.jpg',
          address: '123 Update St',
          latlng: { lat: 40.7128, lng: -74.0060 },
          image: 'update.jpg',
          cuisine_type: 'Mexican',
          operating_hours: { Monday: '9:00 am - 10:00 pm' },
        });
      const createdRestaurantId = createRes.body.id;

      // Actualizar el restaurante creado y verificar que los cambios se reflejen correctamente
      const res = await request(app)
        .put(`/api/restaurants/${createdRestaurantId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Test Restaurant',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated Test Restaurant');
    });

    it('debería devolver un error si el restaurante no existe', async () => {
      // Intentar actualizar un restaurante inexistente y verificar que devuelva un error 404
      const res = await request(app)
        .put('/api/restaurants/12345678')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Non-existent Restaurant',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });

  // Prueba para eliminar un restaurante por ID
  describe('DELETE /api/restaurants/:id', () => {
    it('debería eliminar un restaurante exitosamente', async () => {
      // Crear un restaurante temporal para la prueba de eliminación
      const createRes = await request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Restaurant to Delete',
          neighborhood: 'Delete Neighborhood',
          photograph: 'delete.jpg',
          address: '789 Delete St',
          latlng: { lat: 40.7128, lng: -74.0060 },
          image: 'delete.jpg',
          cuisine_type: 'American',
          operating_hours: { Monday: '8:00 am - 9:00 pm' },
        });

      const restaurantToDeleteId = createRes.body.id;

      // Eliminar el restaurante y verificar que la respuesta sea correcta
      const res = await request(app)
        .delete(`/api/restaurants/${restaurantToDeleteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Entity deleted successfully');
    });

    it('debería devolver un error si el restaurante no existe', async () => {
      // Intentar eliminar un restaurante inexistente y verificar que devuelva un error 404
      const res = await request(app)
        .delete('/api/restaurants/12345678')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Entity not found');
    });
  });
});
