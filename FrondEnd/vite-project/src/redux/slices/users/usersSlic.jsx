import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  autherised: localStorage.getItem("autherised") === "true" || false,
  role: localStorage.getItem("role") || null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.autherised = true;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      localStorage.setItem("autherised", "true");
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.userInfo = null;
      state.autherised = false;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("autherised");
      localStorage.removeItem("role");
    },
    getCoordinates: (state, action) => {
      state.loading = false;
      state.userLocation = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userInfo = { ...state.userInfo, email: action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    // New action to update user info, including address
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  logout,
  getCoordinates,
  setUserEmail,
  updateUserInfo, // Export the new action
} = userSlice.actions;

export default userSlice.reducer;