import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { Provider as URQLProvider, createClient } from "urql";

const client = createClient({
  url: 'http://localhost:3001/graphql',
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <URQLProvider value={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </URQLProvider>
  </React.StrictMode>
);
