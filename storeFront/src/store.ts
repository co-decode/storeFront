import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import itemReducer from "./slices/itemSlice";
import pageReducer from "./slices/pageSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
    reducer: {
        login: loginReducer,
        item: itemReducer,
        page: pageReducer,
        cart: cartReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;