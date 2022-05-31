// import React from "react";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { setPass, setUser } from "./loginSlice";

export function Logger() {
    const password = useSelector((state:RootState) => state.login.password);
    const username = useSelector((state:RootState) => state.login.username);
    const dispatch = useDispatch();

    return (
        <div>
            <button onClick={() => dispatch(setPass("password"))}
            > Set the password to password</button>
            <button onClick={() => dispatch(setUser("user"))}
            > Set the username to user</button>
            <span> The password is: {password}</span>
            <span> The username is: {username}</span>
        </div>
    )
}

