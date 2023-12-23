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

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({ username: "" });
  const dropdownRef = useRef(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const openProfileModal = () => {
    setModalContent(<ProfileContent loggedInUser={loggedInUser} />);
    setShowModal(true);
  };

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

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center pt-4  ">
      <a
        href="/"
        className="text-xl font-bold text-gray-50 tracking-wide hover:scale-105 transition-all ease-linear duration-300"
      >
        Inventory Copilot
      </a>

      <nav className="flex items-center gap-4 lg:gap-8">
        <div className="relative group inline-block" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-slate-300 hover:bg-slate-400/80 p-3 h-10 w-10 rounded-full  focus:outline-none focus:bg-slate-400 flex items-center justify-center"
          >
            <span className="text-xl font-bold uppercase text-gray-700">
              {loggedInUser?.username?.charAt(0)}
            </span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-50 text-zinc-800 rounded-lg drop-shadow-lg">
              <ul>
                <li className="px-4 py-2 hover:bg-zinc-200/80 hover:rounded-t-lg">
                  <button onClick={openProfileModal}>
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 text-zinc-400"
                    />
                    {loggedInUser?.username}
                  </button>
                </li>
                {/*    <li className="px-4 py-2 hover:bg-zinc-200/80">
                  <button onClick={openSettingsModal}>
                    <FontAwesomeIcon
                      icon={faGear}
                      className="mr-2 text-zinc-400"
                    />
                    Settings
                  </button>
                </li> */}
                <li className="px-4 py-2 hover:bg-zinc-200/80 hover:rounded-b-lg">
                  <button onClick={handleLogoutUser}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="mr-2 text-zinc-400"
                    />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <HeaderModal show={showModal} onClose={closeModal}>
          {modalContent}
        </HeaderModal>
      </nav>
    </div>
  );
};

export default Header;
