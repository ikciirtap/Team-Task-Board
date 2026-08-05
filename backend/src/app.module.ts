import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [PrismaModule, UsersModule, TasksModule, TestModule],
})
export class AppModule {}
