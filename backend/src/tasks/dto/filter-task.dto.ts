import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from './create-task.dto';

export class FilterTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
