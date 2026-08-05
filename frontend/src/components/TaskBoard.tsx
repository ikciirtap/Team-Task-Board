import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  RadioButtonUnchecked,
  HourglassFull,
  CheckCircle,
} from '@mui/icons-material';
import type { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteClick: (taskId: string) => void;
}

interface ColumnConfig {
  key: TaskStatus;
  title: string;
  icon: React.ReactNode;
  color: 'default' | 'primary' | 'success';
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'TODO',
    title: 'To Do',
    icon: <RadioButtonUnchecked color="action" fontSize="small" />,
    color: 'default',
  },
  {
    key: 'IN_PROGRESS',
    title: 'In Progress',
    icon: <HourglassFull color="primary" fontSize="small" />,
    color: 'primary',
  },
  {
    key: 'DONE',
    title: 'Done',
    icon: <CheckCircle color="success" fontSize="small" />,
    color: 'success',
  },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onStatusChange,
  onDeleteClick,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        width: '100%',
      }}
    >
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.key);

        return (
          <Paper
            key={column.key}
            elevation={0}
            sx={{
              p: 2,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.5)'
                  : 'rgba(241, 245, 249, 0.7)',
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              minHeight: 500,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                px: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {column.icon}
                <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {column.title}
                </Typography>
              </Box>

              <Chip
                label={columnTasks.length}
                color={column.color}
                size="small"
                sx={{ fontWeight: 700, borderRadius: '12px' }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {columnTasks.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    color: 'text.secondary',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <Typography variant="body2">No tasks in {column.title}</Typography>
                </Box>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onDeleteClick={onDeleteClick}
                  />
                ))
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};
