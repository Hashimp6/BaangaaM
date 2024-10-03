import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    addToCartRequest: (state) => {
      state.loading = true;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.cart.push(action.payload);
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.productId._id !== action.payload);
    },
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((i) => i.productId._id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  setCart,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCart,
  updateCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;