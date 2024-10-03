import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  productDetails: null,
  loading: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsRequest: (state) => {
      state.loading = true;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
  
    fetchProductDetailsSuccess: (state, action) => {
      state.loading = false;
      state.productDetails = action.payload;
    },
    fetchProductDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFail,
  fetchProductDetailsRequest,
  fetchProductDetailsSuccess,
  fetchProductDetailsFail,
} = productSlice.actions;

export default productSlice.reducer;
