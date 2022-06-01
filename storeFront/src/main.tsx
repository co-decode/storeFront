import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Existing from "./components/Existing";
import Create from "./components/Create";
import ChangePassword from "./components/ChangePassword";
import OrderHistory from "./components/OrderHistory";
import User from "./components/User";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { Provider as URQLProvider, createClient } from "urql";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const client = createClient({
  url: "http://localhost:3001/graphql",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <URQLProvider value={client}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />}/>
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />}>
                <Route index element={<Existing/>} />
                <Route path="create" element={<Create/>} />
              </Route>
              <Route path="shop" element={<Shop />} />
              <Route path="cart" element={<Cart />} />
              <Route path="user" element={<User />}>
                <Route path="change" element={<ChangePassword />} />
                <Route path="history" element={<OrderHistory />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </Provider>
    </URQLProvider>
  </React.StrictMode>
);
