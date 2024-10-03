// Admin Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminInfo: null,
  loading: false,
  role: null,
  error: null,
  authorized: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLoginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminLoginSuccess: (state, action) => {
      state.loading = false;
      state.adminInfo = action.payload.admin;
      state.role = action.payload.role;
      state.error = null;
      state.authorized = true;
    },
    adminLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authorized = false;
    },
    adminLogout: (state) => {
      state.adminInfo = null;
      state.role = null;
      state.authorized = false;
      state.error = null;
    },
  },
});

export const {
  adminLoginRequest,
  adminLoginSuccess,
  adminLoginFailure,
  adminLogout
} = adminSlice.actions;

export default adminSlice.reducer;
