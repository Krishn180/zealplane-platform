import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

import { store } from "./store/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./pages/ErrorPage/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <ErrorBoundary>
      <Provider store={store}>
        <GoogleOAuthProvider clientId="828143736041-haj53pivbrua0gi5g14hd27519tipeje.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </Provider>
    </ErrorBoundary>
  </HelmetProvider>
);
