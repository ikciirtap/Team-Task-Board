import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Delete, PersonOutlined } from '@mui/icons-material';
import type { Task, TaskStatus, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteClick: (taskId: string) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'HIGH':
      return { label: 'High', color: 'error' as const };
    case 'MEDIUM':
      return { label: 'Medium', color: 'warning' as const };
    case 'LOW':
      return { label: 'Low', color: 'info' as const };
    default:
      return { label: priority, color: 'default' as const };
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDeleteClick,
}) => {
  const priorityInfo = getPriorityColor(task.priority);

  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={priorityInfo.label}
            color={priorityInfo.color}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />

          <Tooltip title="Delete task">
            <IconButton
              size="small"
              onClick={() => onDeleteClick(task.id)}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, fontWeight: 600 }}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
            pt: 1.5,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {task.assignee ? (
              <Tooltip title={`Assigned to ${task.assignee.name}`}>
                <Avatar
                  src={task.assignee.avatarUrl || undefined}
                  sx={{ width: 26, height: 26, fontSize: '0.8rem', bgcolor: 'primary.main' }}
                >
                  {task.assignee.name.charAt(0)}
                </Avatar>
              </Tooltip>
            ) : (
              <Tooltip title="Unassigned">
                <Avatar sx={{ width: 26, height: 26, bgcolor: 'action.disabledBackground' }}>
                  <PersonOutlined sx={{ fontSize: 16 }} />
                </Avatar>
              </Tooltip>
            )}
            <Typography variant="caption" color="text.secondary">
              {task.assignee ? task.assignee.name : 'Unassigned'}
            </Typography>
          </Box>

          <FormControl size="small" variant="standard" sx={{ minWidth: 100 }}>
            <Select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              disableUnderline
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color:
                  task.status === 'DONE'
                    ? 'success.main'
                    : task.status === 'IN_PROGRESS'
                    ? 'primary.main'
                    : 'text.secondary',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                px: 1,
                py: 0.2,
                borderRadius: 1,
              }}
            >
              <MenuItem value="TODO" sx={{ fontSize: '0.8rem' }}>
                To Do
              </MenuItem>
              <MenuItem value="IN_PROGRESS" sx={{ fontSize: '0.8rem' }}>
                In Progress
              </MenuItem>
              <MenuItem value="DONE" sx={{ fontSize: '0.8rem' }}>
                Done
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};
