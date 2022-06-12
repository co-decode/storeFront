import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PageState {
  page: number,
  limit:number,
}


const initialState: PageState = {
  page: 0,
  limit: 3,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action:PayloadAction<number>) => {
      state.limit = action.payload;
    }
  },
});

export const { setPage, setLimit } = pageSlice.actions;

export default pageSlice.reducer
