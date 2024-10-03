import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shopInfo: null,
  shops: [],
  role: null,
  selectedShop: null,
  loading: false,
  authorized: false,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    storeLoginRequest: (state) => {
      state.loading = true;
    },
    storeLoginSuccess: (state, action) => {
      state.loading = false;
      state.shopInfo = action.payload.shop;
      state.role = action.payload.role;
      state.authorized = true;
    },
    fetchedStores: (state, action) => {
      state.loading = false;
      state.shops = action.payload;
    },
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
    storeLogout: (state) => {
      state.shopInfo = null;
      state.role = null;
      state.authorized = false;
    },
  },
});

export const {
  storeLoginRequest,
  storeLoginSuccess,
  fetchedStores,
  setSelectedShop,
  storeLogout,
} = storeSlice.actions;

export default storeSlice.reducer;