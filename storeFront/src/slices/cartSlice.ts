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
  shopping: Boolean,
}

const initialState: CartState = {
  cart: {date: "", total: 0, items: [{item:"",amount:0,price:0,image:""}]},
  shopping: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartOrder>) => {
      state.cart = action.payload;
    },
    setShopping: (state,action: PayloadAction<Boolean>) => {
      state.shopping = action.payload;
    }
  },
});

export const { setCart, setShopping } = cartSlice.actions;

export default cartSlice.reducer
