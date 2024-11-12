// /backend/__tests__/restaurantsRoutes.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data/AppDataSource';
import { User } from '../src/modules/auth/User';
import { getRestaurantById, getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../src/modules/restaurants/restaurantController';
import { restaurantRepository } from '../src/modules/restaurants/restaurantRepository';

const testUsername = process.env.TEST_USER_USERNAME || 'test-user';
const testPassword = process.env.TEST_USER_PASSWORD || 'test-password';

let token: string;
let queryRunner: any;

beforeAll(async () => {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOneBy({ username: testUsername });

  if (!user) {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: testUsername,
        password: testPassword,
      });
  }

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      username: testUsername,
      password: testPassword,
    });

  token = loginResponse.body.token;
});

beforeEach(async () => {
  queryRunner = AppDataSource.createQueryRunner() as any;
  await queryRunner.startTransaction();
});

afterEach(async () => {
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Restaurant Controller Tests', () => {
  describe('createRestaurant', () => {
    it('should successfully create a new restaurant', async () => {
      const req = {
        body: {
          name: 'Test Restaurant',
          address: '123 Test St',
          image: 'test.jpg'
        }
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      await createRestaurant(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
    });
  });

  describe('getRestaurantById', () => {
    it('should return a restaurant by ID', async () => {
      const createdRestaurant = await restaurantRepository.createRestaurant({
        name: 'Temporary Restaurant',
        address: '456 Temp St',
        image: 'temp.jpg',
        photograph: 'temp_photo.jpg',
        neighborhood: 'Test Neighborhood',
        cuisine_type: 'French',
        latlng: { lat: 0, lng: 0 },
        operating_hours: { Monday: '10:00 am - 11:00 pm' }
      });
    
      expect(createdRestaurant).toBeTruthy();
      expect(createdRestaurant.id).toBeDefined();
    
      const req = { params: { id: createdRestaurant.id } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;
    
      await getRestaurantById(req, res);
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: createdRestaurant.id }));
    });
    

    it('should return 404 if restaurant not found', async () => {
      const req = { params: { id: 'non-existent-id' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      await getRestaurantById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante no encontrado' });
    });
  });

  describe('updateRestaurant', () => {
    it('should update a restaurant successfully', async () => {
      const createdRestaurant = await restaurantRepository.createRestaurant({
        name: 'Restaurant to Update',
        address: '123 Update St',
        image: 'update.jpg',
        photograph: 'update_photo.jpg',
        neighborhood: 'Update Neighborhood',
        cuisine_type: 'Mexican',
        latlng: { lat: 0, lng: 0 },
        operating_hours: { Monday: '9:00 am - 10:00 pm' }
      });
    
      expect(createdRestaurant).toBeTruthy();
      expect(createdRestaurant.id).toBeDefined();
    
      const req = {
        params: { id: createdRestaurant.id },
        body: { name: 'Updated Restaurant' }
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;
    
      await updateRestaurant(req, res);
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Restaurant' }));
    });
    
  });

  describe('deleteRestaurant', () => {
    it('should delete a restaurant successfully', async () => {
      const createdRestaurant = await restaurantRepository.createRestaurant({
        name: 'Restaurant to Delete',
        address: '789 Delete St',
        image: 'delete.jpg',
        photograph: 'delete_photo.jpg',
        neighborhood: 'Delete Neighborhood',
        cuisine_type: 'American',
        latlng: { lat: 0, lng: 0 },
        operating_hours: { Monday: '8:00 am - 9:00 pm' }
      });

      const req = { params: { id: createdRestaurant.id } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      await deleteRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante eliminado correctamente' });
    });

    it('should return 404 if restaurant not found', async () => {
      const req = { params: { id: 'non-existent-id' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      await deleteRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante no encontrado' });
    });
  });
});
