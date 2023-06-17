import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "userDefault",
  initialState: {
    value: true,
  },
  reducers: {
    down: state => {
      state.value = false;
    },
  },
});

export const { down } = slice.actions;
export default slice.reducer;
