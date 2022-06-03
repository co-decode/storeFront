import { Route, Routes, useParams } from "react-router-dom";
import Nav from "./Nav";
import About from "./components/About";
import Cart from "./components/Cart";
import ChangePassword from "./components/ChangePassword";
import Create from "./components/Create";
import Existing from "./components/Existing";
import Home from "./components/Home";
import Login from "./components/Login";
import OrderHistory from "./components/OrderHistory";
import Shop from "./components/Shop";
import User from "./components/User";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function App() {
  const page = useSelector((state: RootState) => state.page.page);
  let {p} = useParams()

  return (
    <Routes>
      <Route path="/" element={<Nav />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />}>
          <Route index element={<Existing />} />
          <Route path="create" element={<Create />} />
        </Route>
        <Route path={`shop`} element={<Shop offset={page} limit={3} />}>
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route path="user" element={<User />}>
          <Route path="change" element={<ChangePassword />} />
          <Route path="history" element={<OrderHistory />} />
        </Route>
      </Route>
    </Routes>
  );
}
