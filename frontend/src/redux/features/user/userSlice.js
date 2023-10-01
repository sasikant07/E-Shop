import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import userService from './userService';

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: [],
    error: "",
}

// Get User
export const getUser = createAsyncThunk("user/getUser", async (_, thunkAPI) => {
    try {
        return await userService.getUser();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Register User
export const register = createAsyncThunk("user/create-user", async (userData, thunkAPI) => {
    try {
        return await userService.register(userData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    RESET(state) {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = "";
      },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
    });
    builder.addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = [];
    });
    builder.addCase(getUser.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = [];
    });
  }
});

export const {RESET} = userSlice.actions

export default userSlice.reducer