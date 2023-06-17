import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "userEdited",
  initialState: {
    value: false,
  },
  reducers: {
    reverse: state => {
      state.value = !state.value;
    },
  },
});

export const { reverse } = slice.actions;
export default slice.reducer;
