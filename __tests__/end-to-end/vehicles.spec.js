const request = require('supertest');
const Application = require('../../src/_shared/application');

const { server } = new Application();

describe('endpoint get /api/vehicles', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    const vehicle = { value: 'R$ 14.532,00', model_id: 1, year_model: 2010, fuel: 'ETANOL' };
    await Vehicle.create(vehicle);
  });

  it("should return a bad request message 'Offset must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=asd');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Offset must be an integer' });
  });

  it("should return a bad request message 'Limit must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=0&limit=asdf');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Limit must be an integer' });
  });

  it("should return a bad request message 'Limit must be greater than zero and less than fifty' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=0&limit=51');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Limit must be greater than zero and less than fifty' });
  });

  it("should return a bad request message 'Limit must be greater than zero and less than fifty' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=0&limit=0');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Limit must be greater than zero and less than fifty' });
  });

  it("should return a bad request message 'modelId must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=0&limit=20&modelId=as12');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'modelId must be an integer' });
  });

  it('should return a successes request with meta and data', async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=0&limit=20');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body.meta).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(Object.keys(response.body.meta)).toEqual(
      expect.arrayContaining(['currentPage', 'itemsPerPage', 'next', 'previous', 'pages', 'offset', 'totalItems'])
    );
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'R$ 14.532,00',
          year_model: 2010,
          fuel: 'ETANOL',
          model: {
            id: 1,
            name: 'Model 1',
            brand: {
              id: 1,
              name: 'Brand 1'
            }
          }
        })
      ])
    );
  });

  it('should return a successes request with meta and data', async () => {
    // Act
    const response = await request(server.callback()).get('/api/vehicles?offset=0&limit=20&modelId=1');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body.meta).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(Object.keys(response.body.meta)).toEqual(
      expect.arrayContaining(['currentPage', 'itemsPerPage', 'next', 'previous', 'pages', 'offset', 'totalItems'])
    );
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'R$ 14.532,00',
          year_model: 2010,
          fuel: 'ETANOL',
          model: {
            id: 1,
            name: 'Model 1',
            brand: {
              id: 1,
              name: 'Brand 1'
            }
          }
        })
      ])
    );
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    await Vehicle.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint get /api/vehicles/{id}', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    const vehicle = { value: 'R$ 14.532,00', model_id: 1, year_model: 2010, fuel: 'ETANOL' };
    await Vehicle.create(vehicle);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/name');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/name')
      .set('Authorization', 'sadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/name')
      .set('Authorization', 'Basicsadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Vehicle id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/name')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Vehicle id must be an integer' });
  });

  it("should return a message 'Vehicle 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/2')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Vehicle 2 not found' });
  });

  it('should return a model and status code = 200', async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toMatchObject({
      id: 1,
      value: 'R$ 14.532,00',
      year_model: 2010,
      fuel: 'ETANOL',
      model_id: 1
    });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    await Vehicle.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint post /api/vehicles', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    const vehicle = { value: 'R$ 14.532,00', model_id: 1, year_model: 2010, fuel: 'ETANOL' };
    await Vehicle.create(vehicle);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', 'sadfghjgfdsa')
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', 'Basicsadfghjgfdsa')
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`)
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: null,
        model_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.533,00',
        model_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.533,00',
        model_id: 1,
        year_model: null
      });

    // Assert
    expect(response.status).toEqual(422);
  });

  it("should return a message 'Model 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Model 2 not found' });
  });

  it('should return a success request and status = 201', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/vehicles')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.532,00',
        model_id: 1,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      id: 2,
      value: 'R$ 14.532,00',
      model_id: 1,
      year_model: 2000,
      fuel: 'GASOLINA'
    });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    await Vehicle.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint put /api/vehicles/{id}', async () => {
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    const vehicle = { value: 'R$ 14.532,00', model_id: 1, year_model: 2010, fuel: 'ETANOL' };
    await Vehicle.create(vehicle);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/name')
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/name')
      .set('Authorization', 'sadfghjgfdsa')
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/name')
      .set('Authorization', 'Basicsadfghjgfdsa')
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`)
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Vehicle id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/name')
      .send({
        value: null,
        model_id: null
      })
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Vehicle id must be an integer' });
  });

  it("should return a message 'Vehicle 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/2')
      .send({
        value: null,
        model_id: null
      })
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Vehicle 2 not found' });
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: null,
        model_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.533,00',
        model_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.533,00',
        model_id: 1,
        year_model: null
      });

    // Assert
    expect(response.status).toEqual(422);
  });

  it("should return a message 'Model 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 14.532,00',
        model_id: 2,
        year_model: 2000,
        fuel: 'GASOLINA'
      });

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Model 2 not found' });
  });

  it('should return a success request and status = 200', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        value: 'R$ 10.532,00',
        model_id: 1,
        year_model: 2000,
        fuel: 'FLEX'
      });

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      id: 1,
      value: 'R$ 10.532,00',
      model_id: 1,
      year_model: 2000,
      fuel: 'FLEX'
    });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    await Vehicle.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint delete /api/vehicles/{id}', async () => {
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    const vehicle = { value: 'R$ 14.532,00', model_id: 1, year_model: 2010, fuel: 'ETANOL' };
    await Vehicle.create(vehicle);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/name');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/name')
      .set('Authorization', 'sadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/name')
      .set('Authorization', 'Basicsadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Vehicle id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/n2na')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Vehicle id must be an integer' });
  });

  it("should return a message 'Vehicle 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/2')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Vehicle 2 not found' });
  });

  it('should return a success request and status code = 204', async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/vehicles/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(204);
  });


  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Vehicle } = require('../../src/business/models/vehicle.model');
    await Vehicle.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});
