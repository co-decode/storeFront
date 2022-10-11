import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { Provider as URQLProvider, createClient } from "urql";
import { BrowserRouter as Router } from "react-router-dom";

const client = createClient({
  url: "https://storefront.up.railway.app/",
  fetchOptions: () => {
    return {
      credentials: "include"
    }
  }
});

// "http://localhost:3001/graphql"
// "https://node-store-front.herokuapp.com/graphql"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <URQLProvider value={client}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </URQLProvider>
  </React.StrictMode>
);
