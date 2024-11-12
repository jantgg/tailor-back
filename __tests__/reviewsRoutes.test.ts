// /backend/__tests__/reviewController.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data/AppDataSource';
import { User } from '../src/modules/auth/User';
import { Restaurant } from '../src/modules/restaurants/Restaurant';
import { createReview, getAllReviews, getReviewById, updateReview, deleteReview } from '../src/modules/reviews/reviewController';
import { reviewRepository } from '../src/modules/reviews/reviewRepository';

const testUsername = process.env.TEST_USER_USERNAME || 'test-user';
const testPassword = process.env.TEST_USER_PASSWORD || 'test-password';

let token: string;
let testRestaurant: Restaurant;

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

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  testRestaurant = await restaurantRepository.save({
    name: 'Test Restaurant',
    address: '123 Test St',
    neighborhood: 'Test Neighborhood',
    photograph: 'test_photo.jpg',
    cuisine_type: 'Italian',
    image: 'test.jpg',
    latlng: { lat: 0, lng: 0 },
    operating_hours: {
      Monday: '10:00 am - 11:00 pm',
    },
  });
});

afterAll(async () => {
  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  if (testRestaurant) {
    await restaurantRepository.delete(testRestaurant.id);
  }
  await AppDataSource.destroy();
});

describe('Review Controller Tests', () => {
  describe('createReview', () => {
    it('should successfully create a new review', async () => {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username: testUsername });

        if (!user) {
            throw new Error('El usuario de prueba no se ha encontrado');
        }

        const req = {
            body: {
                rating: 5,
                comments: 'Excellent food!',
                userId: user.id,
                restaurantId: testRestaurant.id,
                name: 'Test Review',
            },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        await createReview(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
    });
});

  describe('getAllReviews', () => {
    it('should return all reviews', async () => {
      const req = {} as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await getAllReviews(req, res);

      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('getReviewById', () => {
    it('should return a review by ID', async () => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ username: testUsername });

      if (!user) {
        throw new Error('El usuario de prueba no se ha encontrado');
      }

      const createdReview = await reviewRepository.save({
        name: 'Temporary Review',
        rating: 4,
        comments: 'Good food',
        user: user,
        restaurant: testRestaurant,
      });

      const req = { params: { id: createdReview.id } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await getReviewById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: createdReview.id }));
    });

    it('should return 404 if review not found', async () => {
      const req = { params: { id: 'non-existent-id' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await getReviewById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña no encontrada' });
    });
  });

  describe('updateReview', () => {
    it('should update a review successfully', async () => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ username: testUsername });

      if (!user) {
        throw new Error('El usuario de prueba no se ha encontrado');
      }

      const createdReview = await reviewRepository.save({
        name: 'Review to Update',
        rating: 3,
        comments: 'Average food',
        user: user,
        restaurant: testRestaurant,
      });

      const req = {
        params: { id: createdReview.id },
        body: { rating: 5, comments: 'Updated comments' },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ rating: 5, comments: 'Updated comments' }));
    });

    it('should return 404 if review not found', async () => {
      const req = { params: { id: 'non-existent-id' }, body: { comments: 'New comment' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña no encontrada' });
    });
  });

  describe('deleteReview', () => {
    it('should delete a review successfully', async () => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ username: testUsername });

      if (!user) {
        throw new Error('El usuario de prueba no se ha encontrado');
      }

      const createdReview = await reviewRepository.save({
        name: 'Review to Delete',
        rating: 2,
        comments: 'Not so good',
        user: user,
        restaurant: testRestaurant,
      });

      const req = { params: { id: createdReview.id } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña eliminada correctamente' });
    });

    it('should return 404 if review not found', async () => {
      const req = { params: { id: 'non-existent-id' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña no encontrada' });
    });
  });
});
