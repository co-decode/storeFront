import { ActionType } from "../action-types";
import { Action } from "../actions"
import {createSlice} from "@reduxjs/toolkit";

// export const userSlice = createSlice({
//     amount: 0,
//     initialState: {value: {amount: 0}},
//     reducers: {
//         add: (state: ,action) => {
//             state.value += action.payload;
//         }
//     }

// })

// const initialState = 0;

// const reducer = (state: number = initialState, action: Action) => {
//     switch(action.type) {
//         case ActionType.LOGIN:
//             return state += action.payload;
//         default:
//             return state;
//     }
// }

// export default reducer