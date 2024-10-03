import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/users/usersSlic";
import productReducer from "./slices/product/products";
import storeReducer from "./slices/store/storesSlice";
import adminReducer from "./slices/admin/adminSlice";
import cartReducer from "./slices/cart/cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    store: storeReducer,
    admin: adminReducer,
    cart: cartReducer,
  },
});

export default store;
