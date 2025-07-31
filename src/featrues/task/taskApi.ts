import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'art_crafts' | 'nature' | 'family' | 'sport' | 'friends' | 'meditation';
  isCollaborative: boolean;
  collaborators: { _id: string; name: string; email: string }[];
  createdAt: string;
  updatedAt: string;
}

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://taskso-server.onrender.com/api/tasks',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { status?: string; category?: string }>({
      query: ({ status, category }) => {
        const params: Record<string, string> = {};
        if (status) params.status = status;
        if (category) params.category = category;
        return {
          url: '/',
          params,
        };
      },
      providesTags: ['Tasks'],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (taskData) => ({
        url: '/',
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: ['Tasks'],
    }),
    getTaskById: builder.query<Task, string>({
      query: (id) => `/${id}`,
      providesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<Task, { id: string; taskData: Partial<Task> }>({
      query: ({ id, taskData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: taskData,
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} = taskApi;
