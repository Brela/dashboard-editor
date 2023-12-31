import React, { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import DashNavBar from "./DashNav";
import { AuthContext } from "../../../contexts/auth.context";
import Profile from "../../Profile";
import { twMerge } from "tailwind-merge";
import { headerBg } from "../../../css/globalTailwindVars";
import OneClickGuestLogin from "./OneClickGuestLogin";

const DashboardHeader = (props) => {
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
      <div className={twMerge(" flex px-7 border-b", headerBg)}>
        <div className="basis-1/3 flex justify-start p-2 font-bold text-xl  bg-gradient-to-r from-zinc-600 to-zinc-400 tracking-tight text-transparent bg-clip-text">
          <section className="flex flex-col items-center ">
            <h1 className=""> Custom Dashboard</h1>
            <span className="absolute top-7  text-[16px] text-gray-400">
              Demo
            </span>
          </section>
        </div>

        <div className={twMerge("z-50 basis-1/3 flex justify-center")}>
          <DashNavBar />
        </div>
        <section className="basis-1/3 flex items-center justify-end">
          {isLoggedIn ? (
            <Profile {...props} />
          ) : (
            <OneClickGuestLogin {...props} />
          )}
        </section>
      </div>
    </>
  );
};

export default DashboardHeader;
