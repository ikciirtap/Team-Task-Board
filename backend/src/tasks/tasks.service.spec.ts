/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TaskPriority } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assigneeId: 'user-1',
    assignee: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    task: {
      create: jest.fn().mockResolvedValue(mockTask),
      findMany: jest.fn().mockResolvedValue([mockTask]),
      findUnique: jest.fn().mockResolvedValue(mockTask),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockTask, status: TaskStatus.IN_PROGRESS }),
      delete: jest.fn().mockResolvedValue(mockTask),
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get<TasksService>(TasksService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const dto = { title: 'Test Task', description: 'Test Description' };
      const result = await service.create(dto);

      expect(result).toEqual(mockTask);
      expect(prisma.task.create as jest.Mock).toHaveBeenCalledWith({
        data: dto,
        include: { assignee: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockTask]);
      expect(prisma.task.findMany as jest.Mock).toHaveBeenCalled();
    });

    it('should filter tasks by status', async () => {
      await service.findAll({ status: TaskStatus.TODO });

      expect(prisma.task.findMany as jest.Mock).toHaveBeenCalledWith({
        where: { status: TaskStatus.TODO },
        include: { assignee: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single task by ID', async () => {
      const result = await service.findOne('task-1');

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update task status', async () => {
      const result = await service.update('task-1', {
        status: TaskStatus.IN_PROGRESS,
      });

      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const result = await service.remove('task-1');

      expect(result).toEqual(mockTask);
      expect(prisma.task.delete as jest.Mock).toHaveBeenCalledWith({
        where: { id: 'task-1' },
      });
    });
  });
});
