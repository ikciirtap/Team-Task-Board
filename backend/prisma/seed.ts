import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Peter Piper',
      email: 'peter.piper@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=68',
    },
  });

  console.log('Created Users:', [user1.name, user2.name, user3.name]);

  // Create Initial Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design System Documentation',
        description:
          'Update MUI theme tokens, typography scale, and standard color palette.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assigneeId: user1.id,
      },
      {
        title: 'Set up Prisma & SQLite Schema',
        description:
          'Model Task and User entities with 1:N relationship and seed script.',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        assigneeId: user2.id,
      },
      {
        title: 'Implement Redux Toolkit State Management',
        description:
          'Configure RTK Query API slice for tasks CRUD operations and cache invalidation.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        assigneeId: user2.id,
      },
      {
        title: 'Backend NestJS DTO Validation',
        description:
          'Add class-validator decorators for task creation and status updates.',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        assigneeId: user1.id,
      },
      {
        title: 'Write Automated Backend Tests',
        description:
          'Add unit tests for TasksService and E2E tests for REST API endpoints.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: user3.id,
      },
      {
        title: 'Kanban Drag & Drop Polish',
        description:
          'Enhance visual hover effects and drag interaction feedback on board columns.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        assigneeId: user3.id,
      },
    ],
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
