import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PageState {
  page: number,
}


const initialState: PageState = {
  page: 0,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setPage } = pageSlice.actions;

export default pageSlice.reducer
