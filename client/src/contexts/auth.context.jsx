import React, { createContext, useState, useEffect } from "react";
import { useQuery } from 'react-query';
import { authenticateUser } from '../services/authenticationAPIcalls';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const authenticatedUser = await authenticateUser();
        setIsLoggedIn(true);
        setUserId(authenticatedUser.id);
      } catch (error) {
        console.error("Error during authentication:", error.message);
        setIsLoggedIn(false);
      }
    };

    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
