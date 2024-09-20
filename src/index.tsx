import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "rgba(67, 113, 236, 1)",
        colorPrimaryActive: "rgba(67, 113, 236, 1)",
        borderRadius: 3,
      },
      components: {
        Button: {
          // colorBgContainer: "rgba(67, 113, 236, 1)",
        },
      },
    }}
  >
    <App />
  </ConfigProvider> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
