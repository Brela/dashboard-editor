import React, { useContext, useEffect } from "react";
import { Button } from "../../../components";
import { toast } from "react-hot-toast";
import {
  createSeedDataForUser,
  createUser,
  loginUser,
} from "../../../services/userAPIcalls";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../contexts/auth.context";
import { useQueryClient } from "react-query";
import { createDashboard } from "../../../services/dashboardAPIcalls";

const OneClickGuestLogin = (props) => {
  const { isLoggedIn, setIsLoggedIn, authLoading, fetchAuthStatus } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const { refetchDashboardData, changeSelectedDashboard } = props;

  const handleGuestLogin = async () => {
    let toastId = null;
    let uniqueId = String(uuid());
    let username = `Guest ${uniqueId.slice(0, 4)}`;
    let password = String(uuid());
    await fetchAuthStatus();

    try {
      // ------ create guest account ------
      toastId = toast("Creating guest account...", { autoClose: false });
      const userData = await createUser(username, password, true); // isTempAccount = true - flag to delete account later
      toast.dismiss(toastId);

      if (!userData.username) {
        throw new Error(userData.message);
      }

      // ------ login to guest account ------
      const loginData = await loginUser(username, password);

      if (!loginData.user) {
        throw new Error(loginData.message);
      }

      localStorage.removeItem("lastSelectedDashboardId");
      await fetchAuthStatus();

      // clear the demo queries and remove them
      queryClient.setQueryData(["dashboards", "demo"], null);
      queryClient.setQueryData("widgets", null);
      queryClient.removeQueries(["dashboards", "demo"], { exact: true });
      queryClient.removeQueries("widgets");
      //   await refetchDashboardData();

      toast.success("Guest account setup complete", { autoClose: 5000 });

      // ------ create one sample dashboard ------
      toastId = toast("Creating sample dashboard...", { autoClose: false });

      await createDashboard({
        name: "Sample 2",
      });
      await createDashboard({
        name: "Sample 1",
      });

      refetchDashboardData();

      toast.dismiss(toastId);
      toast.success("Sample dashboard created", {
        autoClose: 4000,
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      queryClient.removeQueries("dashboards");
      queryClient.removeQueries("widgets");
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Button
        onClick={handleGuestLogin}
        isLoading={authLoading}
        variant="secondary"
        className="bg-green-500/90 py-2 h-auto my-auto"
      >
        One Click Guest Login
      </Button>
    </div>
  );
};

export default OneClickGuestLogin;
