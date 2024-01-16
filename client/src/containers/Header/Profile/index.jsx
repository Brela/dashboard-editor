import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { logoutUser } from "../../../services/userAPIcalls";
import axios from "axios";
import { toast } from "react-hot-toast";
import ProfileContent from "./ProfileContent";
import HeaderModal from "./HeaderModal";

import { Popover, Modal, Spinner } from "../../../components";
import { useQueryClient } from "react-query";

const Profile = () => {
  const [loggedInUser, setLoggedInUser] = useState({ username: "" });

  const { isLoggedIn, setIsLoggedIn, authLoading } = useContext(AuthContext);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const queryClient = useQueryClient();

  // this is used for the dashboard demo
  /*   useEffect(() => {
    setIsLoggedIn(true);
  }, []); */

  const handleLogoutUser = async () => {
    try {
      await logoutUser();

      setIsLoggedIn(false);
      setLoggedInUser({ username: "" });
      localStorage.removeItem("lastSelectedDashboardId");

      // clear the demo queries and remove them
      queryClient.setQueryData(["dashboards", "user"], null);
      queryClient.setQueryData("widgets", null);
      queryClient.removeQueries(["dashboards", "user"]);
      queryClient.removeQueries("widgets");
    } catch (error) {
      toast.error(`Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.removeQueries("dashboards");
      queryClient.removeQueries("widgets");
    }
  }, [isLoggedIn]);

  // console.log(loggedInUser?.id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: {},
          withCredentials: true,
        });
        setLoggedInUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="">
      <Popover
        trigger={
          <div className="bg-cyan-700 hover:bg-cyan-700/70 p-3 h-8 w-8 rounded-full  focus:outline-none focus:bg-slate-400 flex items-center justify-center">
            {authLoading ? (
              <div className="absolute flex items-center">
                <Spinner size="medium" />
              </div>
            ) : (
              <span className="text-xl font-bold uppercase text-white">
                {loggedInUser?.username?.charAt(0)}
              </span>
            )}
          </div>
        }
        contentClassName="mr-2 px-8"
        content={
          <ul className="flex flex-col items-start gap-3">
            <Popover.CloseOnClickItem
              className="hover:text-gray-500"
              onClick={() => {
                setModalContent(<ProfileContent loggedInUser={loggedInUser} />);
                setShowModal(true);
              }}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2 text-zinc-400" />
              Profile
            </Popover.CloseOnClickItem>
            <Popover.CloseOnClickItem
              className="hover:text-gray-500"
              onClick={handleLogoutUser}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="mr-2 text-zinc-400"
              />
              Sign Out
            </Popover.CloseOnClickItem>
          </ul>
        }
      />

      <HeaderModal show={showModal} onClose={closeModal}>
        {modalContent}
      </HeaderModal>
    </div>
  );
};

export default Profile;
