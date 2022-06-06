import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ItemState {
  item: string,
  price: number;
}


const initialState: ItemState = {
  item: "",
  price: 0,
};

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItem: (state, action: PayloadAction<string>) => {
      state.item = action.payload;
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
  },
});

export const { setItem, setPrice } = itemSlice.actions;

export default itemSlice.reducer
