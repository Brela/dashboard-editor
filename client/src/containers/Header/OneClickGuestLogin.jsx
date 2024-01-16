import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../components";
import { toast } from "react-hot-toast";
import { createUser, loginUser } from "../../services/userAPIcalls";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../contexts/AuthContext";
import { useQueryClient } from "react-query";
import { createDashboard } from "../../services/dashboardAPIcalls";
import useDashboardData from "../../hooks/useDashboardData";
import useWindowSize from "../../hooks/useWindowSize";
import { create } from "lodash";

const OneClickGuestLogin = () => {
  const { isLoggedIn, setIsLoggedIn, userId, authLoading, fetchAuthStatus } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const { refetchDashboardData, changeSelectedDashboard, dashboards } =
    useDashboardData({
      isLoggedIn,
      authLoading,
      userId,
    });

  const isWindowSmall = useWindowSize(1000);

  const handleGuestLogin = async () => {
    let toastId = null;
    let uniqueId = String(uuid());
    let username = `Guest ${uniqueId.slice(0, 4)}`;
    let password = String(uuid());
    await fetchAuthStatus();

    try {
      // ------ create guest account ------
      toastId = toast("Creating guest account...", {
        autoClose: false,
        position: "bottom-center",
      });
      const userData = await createUser(username, password, true); // isTempAccount = true - flag to delete account later
      toast.dismiss(toastId);

      if (!userData?.user?.username) {
        throw new Error(userData.message);
      }

      // ------ login to guest account ------
      const loginData = await loginUser(username, password);
      if (!loginData.user) {
        throw new Error(loginData.message);
      }

      // this was the fix to the async issue!! Removed fetchAuthStatus!!  fetchAuthStatus was causing this component to be unmounted early since this component is conditionally rendered based on auth status
      // await fetchAuthStatus();
      toast.success("Guest account setup complete", {
        autoClose: 5000,
        position: "bottom-center",
      });

      // ------ create one sample dashboard ------
      toastId = toast("Creating sample dashboard...", {
        autoClose: false,
        position: "bottom-center",
      });

      await createDashboard({
        name: "Sample 2",
      });
      await createDashboard({
        name: "Sample 1",
      });

      // refetchDashboardData();
      setIsLoggedIn(true);
      localStorage.removeItem("lastSelectedDashboardId");

      // clear the demo queries and remove them
      queryClient.setQueryData(["dashboards", "user"], null);
      queryClient.setQueryData("widgets", null);
      /*       queryClient.removeQueries(["dashboards", "user"]);
      queryClient.removeQueries("widgets"); */

      toast.dismiss(toastId);
      toast.success("Sample dashboards created", {
        autoClose: 4000,
        position: "bottom-center",
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Button
        onClick={handleGuestLogin}
        isLoading={authLoading}
        variant="secondary"
        className="bg-green-500/90 py-2 h-auto my-auto"
      >
        Guest Login
        {/* {isWindowSmall ? "Guest Login" : "One Click Guest Login"} */}
      </Button>
    </div>
  );
};

export default OneClickGuestLogin;
