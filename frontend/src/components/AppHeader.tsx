import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  DashboardCustomize,
  Assignment,
  HourglassTop,
  CheckCircle,
} from '@mui/icons-material';
import type { Task } from '../types';

interface AppHeaderProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  tasks?: Task[];
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  mode,
  onToggleTheme,
  tasks = [],
}) => {
  const theme = useTheme();

  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              p: 1,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <DashboardCustomize />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Team Task Board
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-Time Full-Stack Task Management
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Chip
              icon={<Assignment fontSize="small" />}
              label={`Total: ${tasks.length}`}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<HourglassTop fontSize="small" color="warning" />}
              label={`To Do: ${todoCount}`}
              size="small"
              color="default"
            />
            <Chip
              icon={<HourglassTop fontSize="small" color="primary" />}
              label={`In Progress: ${inProgressCount}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<CheckCircle fontSize="small" color="success" />}
              label={`Done: ${doneCount}`}
              size="small"
              color="success"
              variant="outlined"
            />
          </Box>

          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {mode === 'dark' ? <LightMode color="warning" /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
