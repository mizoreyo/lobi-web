import { configureStore } from "@reduxjs/toolkit";
import onlineUserReducer from "./features/onlineUserSlice";
import userEditedReducer from "./features/userEditedSlice";
import userDefaultReducer from "./features/userDefultSlice";

export default configureStore({
  reducer: {
    onlineUser: onlineUserReducer,
    userEdited: userEditedReducer,
    userDefault: userDefaultReducer,
  },
});
