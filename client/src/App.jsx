import React, { useState, useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import {
  InventoryProvider,
  InventoryContext,
} from "./contexts/inventory.context";
import { AuthProvider } from "./contexts/auth.context";
import { AuthContext } from "./contexts/auth.context.jsx";
import { Toaster } from "react-hot-toast";
import InventoryCopilotRoutes from "./InventoryCopilotRoutes.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardHome from "./containers/Dashboard/DashHome";
import DashboardEditor from "./containers/Dashboard/DashboardEditor/DashEditor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardProvider } from "./contexts/dash.context.jsx";
import DashboardHeaderRouting from "./containers/Dashboard/index.jsx";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      <DashboardProvider>
        <Router>
          <Routes>
            {/* dashboard editor routes */}

            <Route path="/dashboard/*" element={<DashboardHeaderRouting />} />
            <Route path="/" element={<Navigate to="/copilot" />} />

            {/* inventory copilot routes */}
            {isLoggedIn ? (
              <Route path="/copilot/*" element={<InventoryCopilotRoutes />} />
            ) : (
              <>
                <Route path="/copilot/login" element={<LoginPage />} />
                <Route
                  path="/copilot/*"
                  element={<Navigate to="/copilot/login" />}
                />
              </>
            )}
          </Routes>
        </Router>
      </DashboardProvider>
      {/* new notification */}
      {/* <ToastContainer /> */}
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* old notification */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#FFF",
            borderRadius: "9999px",
            color: "#333",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
};

export default App;
