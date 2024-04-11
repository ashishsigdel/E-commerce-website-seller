import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProduct: null,
  error: null,
  loading: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    createProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess: (state, action) => {
      state.currentProduct = action.payload;
      state.loading = false;
      state.error = null;
    },
    createProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadImageStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    uploadImageSuccess: (state) => {
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
    },
    uploadImageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateOrderSuccess: (state, action) => {
      state.currentProduct = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createProductStart,
  createProductSuccess,
  createProductFailure,
  uploadImageStart,
  uploadImageSuccess,
  uploadImageFailure,
  updateOrderStart,
  updateOrderSuccess,
  updateOrderFailure,
} = productSlice.actions;

export default productSlice.reducer;
