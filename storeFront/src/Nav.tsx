
import "./App.css";

import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function Nav() {

  return (
    
    <div id="app-wrap" className="container-fluid" style={{padding:0}}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Nav;
