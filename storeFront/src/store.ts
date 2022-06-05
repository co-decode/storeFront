import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import itemReducer from "./slices/itemSlice";
import pageReducer from "./slices/pageSlice";

export const store = configureStore({
    reducer: {
        login: loginReducer,
        item: itemReducer,
        page: pageReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;