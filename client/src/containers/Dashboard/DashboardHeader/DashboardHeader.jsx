import React, { useContext, useEffect } from "react";
import { Button, Spinner } from "../../../components";
import { toast } from "react-toastify";
import DashNavBar from "./Nav";
import { AuthContext } from "../../../contexts/auth.context";
import Profile from "../../Profile";
import { createUser, loginUser } from "../../../services/userAPIcalls";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { headerBg } from "../../../css/globalTailwindVars";
import useWindowSize from "../../../hooks/useWindowSize";

const DashboardHeader = () => {
  const { isLoggedIn, setIsLoggedIn, authLoading } = useContext(AuthContext);

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
  const handleGuestLogin = async () => {
    let toastId = null;
    let uniqueId = String(uuid());
    let username = `Guest ${uniqueId.slice(0, 4)}`;
    let password = String(uuid());

    try {
      // to-do: create a flag on guest accont where we can delete it on backend with cron job
      toastId = toast("Creating guest account...", { autoClose: false });
      const userData = await createUser(username, password);
      toast.dismiss(toastId);

      if (!userData.username) {
        throw new Error(userData.message);
      }

      toastId = toast("Logging in to guest account...", { autoClose: false });
      const loginData = await loginUser(username, password);
      toast.dismiss(toastId);

      if (!loginData.user) {
        throw new Error(loginData.message);
      }

      /*       toastId = toast("Creating seed data...", { autoClose: false });
      await createSeedData();
      toast.dismiss(toastId); */
      setIsLoggedIn(true);
      toast("Guest account setup complete", { autoClose: 5000 });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={twMerge(" flex justify- px-3 border-b", headerBg)}>
        <h1 className="basis-1/3 font-bold text-xl p-3 bg-gradient-to-r from-zinc-800 to-zinc-400 text-transparent bg-clip-text">
          Dashboard Demo
        </h1>
        <div className={twMerge("z-25 basis-1/3 flex justify-center")}>
          <DashNavBar />
        </div>
        <section className="basis-1/3 flex items-center justify-end">
          {authLoading || isLoggedIn ? (
            <div className="">
              <Profile />
            </div>
          ) : (
            <Button
              onClick={handleGuestLogin}
              variant="secondary"
              className="bg-green-500 py-2 h-auto my-auto"
            >
              One Click Guest Login
            </Button>
          )}
        </section>
      </div>
    </>
  );
};

export default DashboardHeader;
