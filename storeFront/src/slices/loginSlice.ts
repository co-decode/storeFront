import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id: string,
  username: string,
  password:string,
}

export interface UserState {
  password: string;
  username: string;
  currentUser: UserInfo;
  loggedIn: boolean;
  login: string;
}


const initialState: UserState = {
  password: "",
  username: "",
  currentUser: {id: "", username: "", password:""},
  loggedIn: false,
  login: "EXISTING",
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
    setCurrentUser: (state, action: PayloadAction<UserInfo>) => {
      state.currentUser = action.payload;
    },
    setLogged: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
  },
});

export const { setPass, setUser, setCurrentUser, setLogin, setLogged } = userSlice.actions;

export default userSlice.reducer
