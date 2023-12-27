import {
  faChevronUp,
  faChevronDown,
  faUser,
  faGear,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { logoutUser } from "../../services/userAPIcalls";
import axios from "axios";
import { toast } from "react-hot-toast";
import ProfileContent from "./ProfileContent";
import SettingsContent from "./SettingsContent";
import HeaderModal from "./HeaderModal";
import NavigationBar from "../../components/NavigationBar";
import { Popover, Modal, Spinner } from "../../components";

const Profile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({ username: "" });
  const dropdownRef = useRef(null);
  const { setIsLoggedIn, authLoading } = useContext(AuthContext);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const openSettingsModal = () => {
    setModalContent(<SettingsContent />);
    setShowModal(true);
  };

  const handleLogoutUser = async () => {
    try {
      await logoutUser(); // Calling the API to logout the user
      setIsLoggedIn(false);
      setShowDropdown(false);
      setLoggedInUser({ username: "" });
    } catch (error) {
      toast.error(`Oops! Something went wrong: ${error}`);
    }
  };

  console.log(loggedInUser?.id);

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
          <div className="bg-cyan-700/20 hover:bg-slate-200/80 p-3 h-10 w-10 rounded-full  focus:outline-none focus:bg-slate-400 flex items-center justify-center">
            {authLoading ? (
              <div className="absolute flex items-center">
                <Spinner size="medium" />
              </div>
            ) : (
              <span className="text-xl font-bold uppercase text-gray-700">
                {loggedInUser?.username?.charAt(0)}
              </span>
            )}
          </div>
        }
        contentClassName="mr-2 px-8"
        content={
          <ul className="flex flex-col gap-3">
            <Popover.CloseOnClickItem
              onClick={() => {
                setModalContent(<ProfileContent loggedInUser={loggedInUser} />);
                setShowModal(true);
              }}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2 text-zinc-400" />
              {loggedInUser?.username}
            </Popover.CloseOnClickItem>
            <Popover.CloseOnClickItem onClick={handleLogoutUser}>
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
