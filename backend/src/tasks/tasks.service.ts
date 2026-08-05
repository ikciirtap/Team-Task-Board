import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        assignee: true,
      },
    });
  }

  async findAll(filterDto?: FilterTaskDto) {
    const { status, assigneeId, search } = filterDto || {};
    const where: Prisma.TaskWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    return this.prisma.task.findMany({
      where,
      include: {
        assignee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id); // Throws NotFoundException if missing

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        assignee: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Throws NotFoundException if missing

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
