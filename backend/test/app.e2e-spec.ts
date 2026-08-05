import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Task Board API (e2e)', () => {
  let app: INestApplication;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/users - should return list of seeded users', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('POST /api/tasks - should create a new task', async () => {
    const newTask = {
      title: 'E2E Integration Test Task',
      description: 'Created during e2e testing execution',
      status: 'TODO',
      priority: 'HIGH',
    };

    const res = await request(app.getHttpServer())
      .post('/api/tasks')
      .send(newTask)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.status).toBe('TODO');
    createdTaskId = res.body.id;
  });

  it('GET /api/tasks - should return list of tasks', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/tasks')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('PATCH /api/tasks/:id - should update task status', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/tasks/${createdTaskId}`)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    expect(response.body.status).toBe('IN_PROGRESS');
  });

  it('DELETE /api/tasks/:id - should delete task', async () => {
    await request(app.getHttpServer())
      .delete(`/api/tasks/${createdTaskId}`)
      .expect(204);
  });
});
