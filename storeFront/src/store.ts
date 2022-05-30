import {configureStore, createSlice} from "@reduxjs/toolkit";

interface Adder {
    amount: number
}

const initialState: Adder = {
    amount: 0 ,
}

export const adderSlice = createSlice({
    name: 'adder',
    initialState,
    reducers: {
        increment: (amount) => {
            // amount.value += 1;
        }
    }

})

export default configureStore({
    reducer: {},
})