import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, User, CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Task', 'User'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], TaskFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          if (filters.status && filters.status !== 'ALL') {
            params.append('status', filters.status);
          }
          if (filters.assigneeId && filters.assigneeId !== 'ALL') {
            params.append('assigneeId', filters.assigneeId);
          }
          if (filters.search) {
            params.append('search', filters.search);
          }
        }
        const queryString = params.toString();
        return queryString ? `tasks?${queryString}` : 'tasks';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    createTask: builder.mutation<Task, CreateTaskInput>({
      query: (body) => ({
        url: 'tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskInput }>({
      query: ({ id, data }) => ({
        url: `tasks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetUsersQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
