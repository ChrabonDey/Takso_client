/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { userApi } from './userApi';


interface UserState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.login.matchPending, (state) => {
        state.error = null;
      })
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addMatcher(userApi.endpoints.login.matchRejected, (state, action) => {
        state.error = (action.payload as any)?.data?.message || 'Login failed';
      })
      .addMatcher(userApi.endpoints.register.matchPending, (state) => {
        state.error = null;
      })
      .addMatcher(userApi.endpoints.register.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addMatcher(userApi.endpoints.register.matchRejected, (state, action) => {
        state.error = (action.payload as any)?.data?.message || 'Registration failed';
      })
      .addMatcher(userApi.endpoints.checkAuth.matchFulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addMatcher(userApi.endpoints.checkAuth.matchRejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = userSlice.actions;
export const UserReducer= userSlice.reducer;

