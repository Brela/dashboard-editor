import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardProvider } from "./contexts/DashContext.jsx";
import DashboardRouting from "./Routing.jsx";

const App = () => {
  return (
    <>
      <DashboardProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<DashboardRouting />} />
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
