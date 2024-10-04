import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  shops: [],
  role: null,
  selectedShop: null,
  loading: false,
  shopInfo: JSON.parse(localStorage.getItem("storeInfo")) || null,
  authorized: localStorage.getItem("storeAuthorized") === "true" || false,
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
      localStorage.setItem("storeInfo", JSON.stringify(action.payload));
      localStorage.setItem("storeAuthorized", "true");
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
      localStorage.removeItem("storeInfo");
      localStorage.removeItem("storeAuthorized");
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