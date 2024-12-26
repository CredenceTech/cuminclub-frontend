import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { persistor, store } from "./state/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Analytics } from "@shopify/hydrogen";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Analytics.Provider
        shopify={{
          shopId: "gid://shopify/Shop/68284580066",
          storefrontId: import.meta.env.VITE_SHOPIFY_STOREFRONT_KEY, 
        }}
      >
        <App />
      </Analytics.Provider>
    </PersistGate>
  </Provider>
);
