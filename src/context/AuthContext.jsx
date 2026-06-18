import React, { useEffect } from "react";
import { useState, createContext, useContext } from "react";
import axios from "axios";
import { users } from "../data.js";
import { API_ENDPOINTS } from "../utils/constants.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.BASE);

      const roleMap = {
        "sales manager": "Sales Manager",
        "sales person": "Sales Representative",
        user: "User",
      };

      const formattedUsers = response.data.map((user) => ({
        id: user._id,
        name: user.name || user.email.split("@")[0],
        email: user.email,
        role: roleMap[user.role?.toLowerCase()] || user.role,
        avatar: (user.name || user.email).substring(0, 2).toUpperCase(),
      }));

      setAllUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem("petsfolio_session_user");
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        console.error(
          "Failed to parse saved session, falling back to unauthenticated.",
        );
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedSession = localStorage.getItem("petsfolio_session_user");
    return !!savedSession;
  });

  useEffect(() => {
    fetchUsers();
  }, [isAuthenticated]); // Re-fetch when auth status changes

  // Request OTP from backend
  const sendOtp = async (email) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.SEND_OTP, { email });
      const data = response.data;

      return {
        success: true,
        message: data.message || "OTP sent successfully",
      };
    } catch (error) {
      console.error("Send OTP error:", error);
      const message =
        error.response?.data?.message || "Network error connecting to server.";
      return { success: false, message };
    }
  };

  // Authentication using OTP backend
  const login = async (email, otp) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });
      const data = response.data;

      const roleMap = {
        "sales manager": "Sales Manager",
        "sales person": "Sales Representative",
        user: "User",
      };

      const userWithToken = {
        id: data._id,
        name: data.name || email.split("@")[0],
        email: data.email,
        role: roleMap[data.role?.toLowerCase()] || data.role,
        token: data.token,
        avatar: data.name
          ? data.name.substring(0, 2).toUpperCase()
          : email.substring(0, 2).toUpperCase(),
      };

      setCurrentUser(userWithToken);
      setIsAuthenticated(true);
      localStorage.setItem(
        "petsfolio_session_user",
        JSON.stringify(userWithToken),
      );
      localStorage.setItem("petsfolio_token", data.token);
      return { success: true, user: userWithToken };
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Network error connecting to server.";
      return { success: false, message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("petsfolio_session_user");
  };

  const addSalesPerson = async (name, email) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USERS.BASE, {
        name,
        email,
      });

      // Refresh the users list
      await fetchUsers();
      return response.data;
    } catch (error) {
      console.error("Add salesperson error:", error);
      const message =
        error.response?.data?.message || "Failed to add representative.";
      throw new Error(message);
    }
  };

  const deleteSalesPerson = async (userId) => {
    // Prevent self-deletion if logged in
    if (currentUser && currentUser.id === userId) {
      throw new Error(
        "You cannot delete your own logged-in representative account!",
      );
    }

    try {
      await axios.delete(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error("Delete salesperson error:", error);
      const message =
        error.response?.data?.message ||
        "Could not delete this representative.";
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        allUsers,
        sendOtp,
        login,
        logout,
        addSalesPerson,
        deleteSalesPerson,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
