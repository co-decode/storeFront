import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import loginReducer from "./features/login/loginSlice";
import itemReducer from "./features/itemSlice";
import pageSlice from "./features/pageSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        login: loginReducer,
        item: itemReducer,
        page: pageSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;