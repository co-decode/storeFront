import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  password: string;
  username: string;
}


const initialState: UserState = {
  password: "",
  username: "",
};

export const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setPass: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setPass, setUser } = userSlice.actions;

export default userSlice.reducer
