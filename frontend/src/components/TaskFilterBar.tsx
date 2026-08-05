import React from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Avatar,
  Typography,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import type { TaskFilters, TaskStatus, User } from '../types';

interface TaskFilterBarProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  users?: User[];
  onOpenCreateModal: () => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  users = [],
  onOpenCreateModal,
}) => {
  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStatus: TaskStatus | 'ALL' | null,
  ) => {
    if (newStatus !== null) {
      onFilterChange({ ...filters, status: newStatus });
    }
  };

  const handleAssigneeChange = (event: any) => {
    onFilterChange({ ...filters, assigneeId: event.target.value });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          flexGrow: 1,
        }}
      >
        <TextField
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <ToggleButtonGroup
          value={filters.status || 'ALL'}
          exclusive
          onChange={handleStatusChange}
          size="small"
          color="primary"
          aria-label="Filter tasks by status"
          sx={{ flexWrap: 'wrap' }}
        >
          <ToggleButton value="ALL">All Status</ToggleButton>
          <ToggleButton value="TODO">To Do</ToggleButton>
          <ToggleButton value="IN_PROGRESS">In Progress</ToggleButton>
          <ToggleButton value="DONE">Done</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="assignee-filter-label">Assignee</InputLabel>
          <Select
            labelId="assignee-filter-label"
            value={filters.assigneeId || 'ALL'}
            label="Assignee"
            onChange={handleAssigneeChange}
          >
            <MenuItem value="ALL">
              <em>All Assignees</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={user.avatarUrl || undefined}
                    sx={{ width: 20, height: 20, fontSize: '0.75rem' }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={onOpenCreateModal}
        sx={{
          px: 3,
          py: 1,
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        New Task
      </Button>
    </Paper>
  );
};
