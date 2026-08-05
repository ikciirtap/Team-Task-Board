import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import type { CreateTaskInput, TaskPriority, TaskStatus, User } from '../types';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskInput: CreateTaskInput) => Promise<void>;
  users?: User[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  users = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId || undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setAssigneeId('');
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Task</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Task Title"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error && !title.trim()}
              helperText={!title.trim() && error ? error : ''}
              placeholder="e.g. Implement OAuth2 login flow"
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or relevant links..."
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="priority-select-label">Priority</InputLabel>
                <Select
                  labelId="priority-select-label"
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel id="assignee-select-label">Assignee</InputLabel>
              <Select
                labelId="assignee-select-label"
                value={assigneeId}
                label="Assignee"
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={user.avatarUrl || undefined}
                        sx={{ width: 22, height: 22, fontSize: '0.75rem' }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{user.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
