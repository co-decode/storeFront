import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface OrderItems {
    item: string,
    amount: number,
    price: number,
    image: string,
}


interface CartOrder {
    date: string,
    items: OrderItems[],
    total: number,
}

export interface CartState {
  cart: CartOrder,
}

const initialState: CartState = {
  cart: {date: "", total: 0, items: [{item:"",amount:0,price:0,image:""}]}
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartOrder>) => {
      state.cart = action.payload;
    },
  },
});

export const { setCart } = cartSlice.actions;

export default cartSlice.reducer
