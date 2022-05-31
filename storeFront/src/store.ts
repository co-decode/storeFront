import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import loginReducer from "./features/login/loginSlice";
import itemReducer from "./features/itemSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        login: loginReducer,
        item: itemReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;