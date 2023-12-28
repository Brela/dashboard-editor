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

const OneClickGuestLogin = ({ refetchDashboardData }) => {
  const { isLoggedIn, setIsLoggedIn, authLoading } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLoggedIn(false);
  }, []);

  const handleGuestLogin = async () => {
    let toastId = null;
    let uniqueId = String(uuid());
    let username = `Guest ${uniqueId.slice(0, 4)}`;
    let password = String(uuid());

    try {
      toastId = toast("Creating guest account...", { autoClose: false });
      const userData = await createUser(username, password, true); // isTempAccount = true - flag to delete account later
      toast.dismiss(toastId);

      if (!userData.username) {
        throw new Error(userData.message);
      }

      //   toastId = toast("Logging in...", { autoClose: false });
      const loginData = await loginUser(username, password);
      //   toast.dismiss(toastId);

      if (!loginData.user) {
        throw new Error(loginData.message);
      }
      queryClient.setQueryData("dashboards", null);
      queryClient.setQueryData("widgets", null);

      // Then remove the queries
      queryClient.removeQueries("dashboards");
      queryClient.removeQueries("widgets");

      setIsLoggedIn(true);

      toast.success("Guest account setup complete", { autoClose: 5000 });

      toastId = toast("Creating sample data...", { autoClose: false });
      let seedData = await createSeedDataForUser();

      toast.dismiss(toastId);
      toast.success("Sample dashboards and widgets created", {
        autoClose: 5000,
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !authLoading) {
      // Invalidate the "dashboards" and "widgets" queries when the user logs in and authLoading is false
      refetchDashboardData();
    }
  }, [isLoggedIn, authLoading]);

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
