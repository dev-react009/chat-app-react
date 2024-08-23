import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./reducers/auth/register/registerReducer";
import loginReducer from "./reducers/auth/login/loginReducer";
import chatRoomReducer from "./reducers/chatReducer/createChatRoom";


export const store = configureStore({
  reducer: {
    registerReducer,
    loginReducer,
    chatRoomReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
