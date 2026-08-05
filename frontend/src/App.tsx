import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { getAppTheme } from './theme';
import { AppHeader } from './components/AppHeader';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskBoard } from './components/TaskBoard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import {
  useGetTasksQuery,
  useGetUsersQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from './services/tasksApi';
import type { TaskFilters, TaskStatus, CreateTaskInput } from './types';

export const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'ALL',
    assigneeId: 'ALL',
    search: '',
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // RTK Query Hooks
  const { data: tasks = [], isLoading: isLoadingTasks, isError: isTasksError, refetch } = useGetTasksQuery(filters);
  const { data: users = [] } = useGetUsersQuery();

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask({ id: taskId, data: { status: newStatus } }).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    await createTask(input).unwrap();
  };

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId).unwrap();
      setDeleteTaskId(null);
    }
  };

  const taskToDelete = tasks.find((t) => t.id === deleteTaskId);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
        <AppHeader mode={mode} onToggleTheme={toggleTheme} tasks={tasks} />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <TaskFilterBar
            filters={filters}
            onFilterChange={setFilters}
            users={users}
            onOpenCreateModal={() => setIsCreateOpen(true)}
          />

          {isTasksError && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Typography variant="body2" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => refetch()}>
                  Retry
                </Typography>
              }
            >
              Failed to load tasks from server. Make sure the NestJS backend is running on http://localhost:3000.
            </Alert>
          )}

          {isLoadingTasks ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <TaskBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDeleteClick={(id) => setDeleteTaskId(id)}
            />
          )}
        </Container>

        <CreateTaskModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateTask}
          users={users}
        />

        <DeleteConfirmModal
          open={!!deleteTaskId}
          onClose={() => setDeleteTaskId(null)}
          onConfirm={handleDeleteConfirm}
          taskTitle={taskToDelete?.title}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
