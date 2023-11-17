import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./context/store";
import { registerLicense } from '@syncfusion/ej2-base';

const root = ReactDOM.createRoot(document.getElementById("root"));
registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF5cWWdCf1FpRGVGfV5yd0VPalhZTnRYUj0eQnxTdEZiWH5YcnVRTmVfV0V1XQ==')
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
