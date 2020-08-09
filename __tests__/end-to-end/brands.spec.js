const request = require('supertest');
const Application = require('../../src/_shared/application');

const { server } = new Application();

describe('endpoint get /api/brands', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);
  });

  it("should return a bad request message 'offset and limit must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback()).get('/api/brands');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'offset and limit must be an integer' });
  });

  it('should return a successes request with meta and data', async () => {
    // Act
    const response = await request(server.callback()).get('/api/brands?offset=0&limit=20');

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
          name: 'Brand 1'
        })
      ])
    );
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint get /api/brands/{id}', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/name');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/name')
      .set('Authorization', 'sadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/name')
      .set('Authorization', 'Basicsadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Brand id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/name')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Brand id must be an integer' });
  });

  it("should return a message 'Brand 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/2')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Brand 2 not found' });
  });

  it('should return a brand and status code = 200', async () => {
    // Act
    const response = await request(server.callback())
      .get('/api/brands/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toMatchObject({
      id: 1,
      name: 'Brand 1'
    });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint post /api/brands', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);
  });
  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .send({
        name: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .set('Authorization', 'sadfghjgfdsa')
      .send({
        name: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .set('Authorization', 'Basicsadfghjgfdsa')
      .send({
        name: 1
      });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`)
      .send({
        name: 1
      });

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 1
      });

    // Assert
    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      expect.arrayContaining([{
        validation: 'isString',
        message: 'Required a valid string value',
        value: 1,
        param: 'name'
      }])
    );
  });

  it("should return a message 'Brand Brand 1 already exists' and status = 409", async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Brand 1'
      });

    // Assert
    expect(response.status).toEqual(409);
    expect(response.body).toEqual({ message: 'Brand Brand 1 already exists' });
  });

  it('should return a success request and status = 201', async () => {
    // Act
    const response = await request(server.callback())
      .post('/api/brands')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Brand 2'
      });

    // Assert
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({ id: 2, name: 'Brand 2' });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint put /api/brands/{id}', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const brand = { name: 'Brand 1' };
    await Brand.create(brand);
  });

  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/name')
      .send({ name: 'Brand 3' });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/name')
      .set('Authorization', 'sadfghjgfdsa')
      .send({ name: 'Brand 3' });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/name')
      .set('Authorization', 'Basicsadfghjgfdsa')
      .send({ name: 'Brand 3' });

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`)
      .send({ name: 'Brand 3' });

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Brand id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/name')
      .send({ name: 'Brand 3' })
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Brand id must be an integer' });
  });

  it('should return an array message and status = 422', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 1
      });

    // Assert
    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      expect.arrayContaining([{
        validation: 'isString',
        message: 'Required a valid string value',
        value: 1,
        param: 'name'
      }])
    );
  });

  it("should return a message 'Brand 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/2')
      .send({ name: 'Brand 3' })
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Brand 2 not found' });
  });

  it("should return a message 'Brand Brand 1 already exists' and status = 409", async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Brand 1'
      });

    // Assert
    expect(response.status).toEqual(409);
    expect(response.body).toEqual({ message: 'Brand Brand 1 already exists' });
  });

  it('should return a success request and status = 200', async () => {
    // Act
    const response = await request(server.callback())
      .put('/api/brands/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`)
      .send({
        name: 'Brand 2'
      });

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ id: 1, name: 'Brand 2' });
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});

describe('endpoint delete /api/brands/{id}', async () => {
  // Arrange
  beforeAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const { Model } = require('../../src/business/models/model.model');

    const brand = { name: 'Brand 1' };
    await Brand.create(brand);

    const model = { name: 'Model 1', brand_id: 1 };
    await Model.create(model);
  });
  it("should return a message 'Missing Authorization Header' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/name');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Missing Authorization Header' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/name')
      .set('Authorization', 'sadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'Bad Authentication' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/name')
      .set('Authorization', 'Basicsadfghjgfdsa');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Bad Authentication' });
  });

  it("should return a message 'You do not have access to this resource' and status code = 401", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/name')
      .set('Authorization', `Basic ${Buffer.from('username_test:password_test').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'You do not have access to this resource' });
  });

  it("should return a message 'Brand id must be an integer' and status code = 400", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/n2na')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: 'Brand id must be an integer' });
  });

  it("should return a message 'Brand 2 not found' and status code = 404", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/2')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Brand 2 not found' });
  });

  it("should return a message 'You can not delete this brand 1 because there is a model registered with this brand' and status code = 409", async () => {
    // Act
    const response = await request(server.callback())
      .delete('/api/brands/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(409);
    expect(response.body).toEqual({ message: 'You can not delete this brand 1 because there is a model registered with this brand' });
  });

  it('should return a success request and status code = 204', async () => {
    // Arrange
    const { Model } = require('../../src/business/models/model.model');
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });

    // Act
    const response = await request(server.callback())
      .delete('/api/brands/1')
      .set('Authorization', `Basic ${Buffer.from('username:password').toString('base64')}`);

    // Assert
    expect(response.status).toEqual(204);
  });

  afterAll(async () => {
    const { Brand } = require('../../src/business/models/brand.model');
    const { Model } = require('../../src/business/models/model.model');

    await Brand.truncate({ cascade: true, force: true, restartIdentity: true });
    await Model.truncate({ cascade: true, force: true, restartIdentity: true });
  });
});
