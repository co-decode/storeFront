import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Navbar() {

  const currentUser = useSelector((state:RootState) => state.login.currentUser)

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          My Fitness Store
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            { currentUser.username ?
            <li className="nav-item">
              <Link className="nav-link" to="/user">
                User Profile
              </Link>
            </li>
            : null
            } 
            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/login"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Login
              </Link>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <Link className="dropdown-item" to="/login">
                    Use Existing Account
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/login/create">
                    Create Account
                  </Link>
                </li>
              </ul>
            </li> */}
            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/user"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                User Profile
              </Link>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <Link className="dropdown-item" to="/user/change">
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/user/history">
                    Order History
                  </Link>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
