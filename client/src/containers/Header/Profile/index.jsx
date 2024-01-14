import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { logoutUser } from "../../../services/userAPIcalls";
import axios from "axios";
import { toast } from "react-hot-toast";
import DetailsModal from "./DetailsModal";
import ModalContainer from "./ModalContainer";

import { Popover, Modal, Spinner } from "../../../components";
import { useQueryClient } from "react-query";

const Profile = () => {
  const { user, logoutUser, authLoading } = useContext(AuthContext);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const queryClient = useQueryClient();

  const handleLogoutUser = async () => {
    try {
      await logoutUser();

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
    if (!user) {
      queryClient.removeQueries("dashboards");
      queryClient.removeQueries("widgets");
    }
  }, [user]);

  // console.log(user?.id);

  // todo - this was how we were fetching the user before we had appWrite
  /*   useEffect(() => {
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
  }, []); */

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
              <span className="text-lg font-bold uppercase text-white">
                {user?.username?.charAt(0) || "A"}
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
                setModalContent(<DetailsModal user={user} />);
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

      <ModalContainer show={showModal} onClose={closeModal}>
        {modalContent}
      </ModalContainer>
    </div>
  );
};

export default Profile;
