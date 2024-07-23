const request = require('supertest');
const app = require('../app');

describe('Product API', () => {
  beforeAll(async () => {
    // Ensure database is connected and sync models
    const { sequelize } = require('../models');
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection after tests
    const { sequelize } = require('../models');
    await sequelize.close();
  });

  it('should return a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array); // Expect an array if that's the correct response
    expect(res.body.length).toBeGreaterThan(0); // Ensure there's at least one product in the array
  }, 30000); // Increase the timeout to 30 seconds
});
