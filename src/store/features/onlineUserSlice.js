import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "onlineUser",
  initialState: {
    value: null,
  },
  reducers: {
    setOnlineUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setOnlineUser } = slice.actions;
export default slice.reducer;
