import React, { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import DashNavBar from "./Nav";
import { AuthContext } from "../../../contexts/auth.context";
import Profile from "../../Profile";
import { twMerge } from "tailwind-merge";
import { headerBg } from "../../../css/globalTailwindVars";
import OneClickGuestLogin from "./OneClickGuestLogin";

const DashboardHeader = ({ refetchDashboardData }) => {
  const { isLoggedIn, authLoading } = useContext(AuthContext);

  // show info toast about logging in as guest - show one time only
  useEffect(() => {
    const hasShownToast = localStorage.getItem("hasShownToast");

    if (!hasShownToast) {
      toast(
        <section className="text-slate-700">
          {` To create and save edited dashboards, click the "One Click Guest
          Login" button on right to seamlessly sign in as a guest and use all
          features.`}
        </section>,
        { autoClose: 15000, theme: "dark", position: "bottom-center" },
      );

      localStorage.setItem("hasShownToast", "true");
    }
  }, []);

  return (
    <>
      <div className={twMerge(" flex justify- px-3 border-b", headerBg)}>
        <h1 className="basis-1/3 font-bold text-xl p-3 bg-gradient-to-r from-zinc-800 to-zinc-400 text-transparent bg-clip-text">
          Dashboard Demo
        </h1>
        <div className={twMerge("z-50 basis-1/3 flex justify-center")}>
          <DashNavBar />
        </div>
        <section className="basis-1/3 flex items-center justify-end">
          {authLoading || isLoggedIn ? (
            <div className="">
              <Profile refetchDashboardData={refetchDashboardData} />
            </div>
          ) : (
            <OneClickGuestLogin refetchDashboardData={refetchDashboardData} />
          )}
        </section>
      </div>
    </>
  );
};

export default DashboardHeader;
