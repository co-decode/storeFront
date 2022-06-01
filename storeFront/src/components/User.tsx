import { Outlet } from "react-router-dom";

export default function User() {
    return(
        <div className="position-relative">
            The current user is 'user' || You are not logged in.
            <Outlet />
        </div>
    )
}