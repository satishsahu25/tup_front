import { createSlice } from '@reduxjs/toolkit';

const normalizeUser = (payload) => {
  if (!payload) return null;
  return payload.user || payload;
};

const initialState = {
  currentUser: null,
  authToken: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = normalizeUser(action.payload);
      state.authToken = action.payload?.token || action.payload?.authToken || null;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = normalizeUser(action.payload);
      if (action.payload?.token || action.payload?.authToken) {
        state.authToken = action.payload?.token || action.payload?.authToken;
      }
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.authToken = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.authToken = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE', (state, action) => {
      const rehydratedUser = action?.payload?.user?.currentUser;
      if (rehydratedUser) {
        state.currentUser = normalizeUser(rehydratedUser);
      }
      const rehydratedToken = action?.payload?.user?.authToken;
      if (rehydratedToken) {
        state.authToken = rehydratedToken;
      }
    });
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
