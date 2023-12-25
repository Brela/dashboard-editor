import React, { useEffect } from "react";
import { Button } from "../../components";
import { toast } from "react-toastify";

const DashboardHeader = () => {
  useEffect(() => {
    toast(
      <div className="text-slate-700">
        To create and edit some dashboards, click the "One Click Guest Login"
        button on right to seamlessly sign in as a guest and use all features.
      </div>,
      { autoClose: 15000, theme: "dark" },
    );
  }, []);

  return (
    <>
      <div className=" flex justify-between px-3">
        <h1 className="font-bold text-xl p-3">Dashboard Demo</h1>
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
