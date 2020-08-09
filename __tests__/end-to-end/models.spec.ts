const request = require('supertest');
const Application = require('../../src/_shared/application');

const { server } = new Application();

describe('endpoint get /api/models', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);
  });

  it("should return a bad request message 'Offset must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=asd');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Offset must be an integer' });
  });

  it("should return a bad request message 'Limit must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=0&limit=asdf');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Limit must be an integer' });
  });

  it("should return a bad request message 'Limit must be greater than zero and less than fifty' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=0&limit=51');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Limit must be greater than zero and less than fifty' });
  });

  it("should return a bad request message 'Limit must be greater than zero and less than fifty' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=0&limit=0');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Limit must be greater than zero and less than fifty' });
  });

  it("should return a bad request message 'brandId must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=0&limit=20&brandId=asd');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'brandId must be an integer' });
  });

  it('should return a successes request with meta and data', async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=0&limit=20');

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
          id: 1,
          name: 'Model 1'
        })
      ])
    );
  });

  it('should return a successes request with meta and data', async () => {
    // Act
    const response = await request(server.callback()).get('/api/models?offset=0&limit=20&brandId=1');

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
          id: 1,
          name: 'Model 1'
        })
      ])
    );
  });


  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint get /api/models/{id}', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/name');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/name')
      .set('Authorization', 'sadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/name')
      .set('Authorization', 'Basicsadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Model id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/name')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Model id must be an integer' });
  });

  it("should return a message 'Model 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/2')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Model 2 not found' });
  });

  it('should return a model and status code = 200', async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toMatchObject({
      id: 1,
      name: 'Model 1',
      brand_id: 1
    });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint post /api/models', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', 'sadfghjgfdsa')
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', 'Basicsadfghjgfdsa')
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`)
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: null,
        brand_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      expect.arrayContaining([{
        validation: 'isString',
        message: 'Required a valid string value',
        value: null,
        param: 'name'
      }])
    );
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 1',
        brand_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      expect.arrayContaining([{
        validation: 'isNotNullOrUndefined',
        message: 'Required value other than null or undefined',
        value: null,
        param: 'brand_id'
      }])
    );
  });

  it("should return a message 'Model Model 1 already exists' and status = 409", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(409);
    expect(response.body).toEqual({ message: 'Model Model 1 already exists' });
  });

  it("should return a message 'Brand 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 2',
        brand_id: 2
      });

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Brand 2 not found' });
  });

  it('should return a success request and status = 201', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/models')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 2',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({ id: 2, name: 'Model 2' });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint put /api/models/{id}', async () => {
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const { Model } = require('../../src/business/models/model.model');
    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/name')
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/name')
      .set('Authorization', 'sadfghjgfdsa')
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/name')
      .set('Authorization', 'Basicsadfghjgfdsa')
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`)
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Model id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/name')
      .send({ name: 'Model 3' })
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Model id must be an integer' });
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: null,
        brand_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      expect.arrayContaining([{
        validation: 'isString',
        message: 'Required a valid string value',
        value: null,
        param: 'name'
      }])
    );
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 1',
        brand_id: null
      });

    // Assert
    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      expect.arrayContaining([{
        validation: 'isNotNullOrUndefined',
        message: 'Required value other than null or undefined',
        value: null,
        param: 'brand_id'
      }])
    );
  });

  it("should return a message 'Model 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/2')
      .send({ name: 'Model 3', brand_id: 1 })
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Model 2 not found' });
  });

  it("should return a message 'Model Model 1 already exists' and status = 409", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 1',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(409);
    expect(response.body).toEqual({ message: 'Model Model 1 already exists' });
  });

  it("should return a message 'Brand 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 2',
        brand_id: 2
      });

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Brand 2 not found' });
  });

  it('should return a success request and status = 200', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Model 2',
        brand_id: 1
      });

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ id: 1, name: 'Model 2' });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });

    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint delete /api/models/{id}', async () => {
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
      .delete('/api/models/name');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/models/name')
      .set('Authorization', 'sadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/models/name')
      .set('Authorization', 'Basicsadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/models/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Model id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/models/n2na')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Model id must be an integer' });
  });

  it("should return a message 'Model 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/models/2')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Model 2 not found' });
  });

  it("should return a message 'You can not delete this model 1 because there is a vehicle registered with this model' and status code = 409", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/models/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(409);
    expect(response.body).toEqual({ message: 'You can not delete this model 1 because there is a vehicle registered with this model' });
  });

  it('should return a success request and status code = 204', async () => {
    // Arrange
    const { Vehicle } = require('../../src/business/models/vehicle.model');
    await Vehicle.truncate({ cascade: true, force: true, restartIdentity: true });

    // Act
    const response = await request(server.callback())
      .delete('/api/models/1')
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