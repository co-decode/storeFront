import { Route, Routes } from "react-router-dom";
import Nav from "./Nav";
import About from "./components/About";
import Cart from "./components/Cart";
import Home from "./components/Home";
import Login from "./components/Login";
import Shop from "./components/Shop";
import User from "./components/User";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function App() {
  const page = useSelector((state: RootState) => state.page.page);
  const limit = useSelector((state:RootState)=> state.page.limit)

  return (
    <Routes>
      <Route path="/" element={<Nav />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} /> 
        <Route path={`shop`} element={<Shop offset={page} limit={limit} />}>
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route path="user" element={<User />}>
        </Route>
      </Route>
    </Routes>
  );
}
