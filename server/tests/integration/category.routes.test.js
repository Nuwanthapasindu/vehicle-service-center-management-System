const request = require('supertest');
const express = require('express');

const categoryRoutes = require('../../routes/category.route');
const Category = require('../../model/Category');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567' };
    next();
  }
}));

jest.mock('../../model/Category');

const app = express();
app.use(express.json());
app.use('/categories', categoryRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Category Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      Category.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: 'cat1', name: 'Category 1' }])
      });

      const res = await request(app).get('/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.data.length).toBe(1);
      expect(res.body.payload.data[0].name).toBe('Category 1');
    });
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      Category.create.mockResolvedValue({ _id: 'cat123', name: 'New Category' });

      const res = await request(app)
        .post('/categories')
        .send({ name: 'New Category' });

      expect(res.statusCode).toBe(201);
      expect(res.body.payload.data.name).toBe('New Category');
    });
  });

  describe('PATCH /categories/:id', () => {
    it('should update a category', async () => {
      Category.findOneAndUpdate.mockResolvedValue({ _id: 'cat123', name: 'Updated Category' });

      const res = await request(app)
        .patch('/categories/cat123')
        .send({ name: 'Updated Category' });

      expect(res.statusCode).toBe(200);
      expect(res.body.payload.data.name).toBe('Updated Category');
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should soft delete a category', async () => {
      Category.findOneAndUpdate.mockResolvedValue({ _id: 'cat123', isDeleted: true });

      const res = await request(app).delete('/categories/cat123');

      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('Category deleted');
    });
  });
});