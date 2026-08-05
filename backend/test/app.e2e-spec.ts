import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
}

describe('Task Board API (e2e)', () => {
  let app: INestApplication;
  let server: App;
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
    server = app.getHttpServer() as App;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/users - should return list of seeded users', async () => {
    const response = await request(server).get('/api/users').expect(200);

    const body = response.body as unknown[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it('POST /api/tasks - should create a new task', async () => {
    const newTask = {
      title: 'E2E Integration Test Task',
      description: 'Created during e2e testing execution',
      status: 'TODO',
      priority: 'HIGH',
    };

    const res = await request(server)
      .post('/api/tasks')
      .send(newTask)
      .expect(201);

    const task = res.body as TaskResponse;
    expect(task).toHaveProperty('id');
    expect(task.title).toBe(newTask.title);
    expect(task.status).toBe('TODO');
    createdTaskId = task.id;
  });

  it('GET /api/tasks - should return list of tasks', async () => {
    const response = await request(server).get('/api/tasks').expect(200);

    const body = response.body as TaskResponse[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it('PATCH /api/tasks/:id - should update task status', async () => {
    const response = await request(server)
      .patch(`/api/tasks/${createdTaskId}`)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    const task = response.body as TaskResponse;
    expect(task.status).toBe('IN_PROGRESS');
  });

  it('DELETE /api/tasks/:id - should delete task', async () => {
    await request(server).delete(`/api/tasks/${createdTaskId}`).expect(204);
  });
});
