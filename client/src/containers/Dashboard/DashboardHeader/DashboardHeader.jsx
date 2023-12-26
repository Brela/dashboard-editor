import React, { useEffect } from "react";
import { Button } from "../../../components";
import { toast } from "react-toastify";
import DashNavBar from "./Nav";

const DashboardHeader = () => {
  useEffect(() => {
    const hasShownToast = localStorage.getItem("hasShownToast");

    if (!hasShownToast) {
      toast(
        <section className="text-slate-700">
          To create and save edited dashboards, click the "One Click Guest
          Login" button on right to seamlessly sign in as a guest and use all
          features.
        </section>,
        { autoClose: 15000, theme: "dark", position: "bottom-center" },
      );

      localStorage.setItem("hasShownToast", "true");
    }
  }, []);

  return (
    <>
      <div className=" flex justify-between px-3 border-b pb-3">
        <h1 className="font-bold text-xl p-3 bg-gradient-to-r from-zinc-800 to-zinc-400 text-transparent bg-clip-text">
          Dashboard Demo
        </h1>
        <DashNavBar />
        <Button
          //   onClick={testNotify}
          variant="secondary"
          className="bg-green-500 py-2 h-auto my-auto"
        >
          One Click Guest Login
        </Button>
      </div>
    </>
  );
};

export default DashboardHeader;
