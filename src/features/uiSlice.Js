import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
  Categories: "all",
    showForm: false,
  },
  reducers: {
    allcategory: (state, action) => {
      state.Categories = action.payload;
    },
    
    closeForm: (state) => {
      state.showForm = false;
    },
  },
});

export const{allcategory,closeForm}=uiSlice.actions;
export default uiSlice.reducer;