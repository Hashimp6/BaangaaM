import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminInfo: null,
  loading: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLoginRequest: (state) => {
      state.loading = true;
    },
    adminLoginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
  },
});

export const { adminLoginRequest, adminLoginSuccess} = adminSlice.actions;

export default adminSlice.reducer;
