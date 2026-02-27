import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null, // "auth user details"
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to automatically fetch authenticated user after login or token restore
export const fetchAuthenticatedUser = createAsyncThunk(
  "auth/fetchAuthenticatedUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      // Returns { authenticatedUser: ... } from your backend payload
      return response.data.payload.authenticatedUser;
    } catch (error) {
      // Return exact error message from backend if available
      return rejectWithValue(
        error.response?.data?.payload?.message || "Failed to fetch user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthenticatedUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // Set the user profile directly from /auth/me
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthenticatedUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // Depending on your requirements, a failed /auth/me usually implies tokens are dead
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
