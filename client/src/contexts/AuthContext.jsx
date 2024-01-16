import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import { v4 as uuid } from "uuid";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();

  const [authLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //setLoading(false)
    checkUserStatus();
  }, []);

  const logoutUser = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const loginAnonymousUser = async () => {
    setLoading(true);
    try {
      // if (user) {
      await logoutUser();
      // }

      // await account.createAnonymousSession();

      const randomId = Math.floor(Math.random() * 100);
      console.log(randomId);
      const email = `Guest${String(uuid()).slice(0, 4)}@gmail.com`;
      const password = String(uuid()).slice(0, 9);
      // register
      await account.create(ID.unique(), email, password);

      // login
      await account.createEmailSession(email, password);

      let accountDetails = await account.get();
      console.log("account details: ", accountDetails);
      setUser(accountDetails);
      // navigate("/"); - don't need this for this app
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const checkUserStatus = async () => {
    try {
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const contextData = {
    user,
    loginAnonymousUser,
    logoutUser,
    authLoading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {/* {authLoading ? <p>Loading...</p> : children} */}
      {children}
    </AuthContext.Provider>
  );
};

//Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
