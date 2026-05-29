import React, { useEffect } from "react";
import { useState, createContext, useContext } from "react";
import { users } from "../data.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("petsfolio_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(
          "Failed to parse saved users, falling back to initial data.",
          e,
        );
      }
    }
    return users;
  });

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
    localStorage.setItem("petsfolio_users", JSON.stringify(allUsers));
  }, [allUsers]);

  // Simple authentication based on simulated credential pool
  const login = (email, password, role) => {
    const foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (foundUser) {
      const userWithRole = { ...foundUser, role: role || foundUser.role };
      setCurrentUser(userWithRole);
      setIsAuthenticated(true);
      localStorage.setItem(
        "petsfolio_session_user",
        JSON.stringify(userWithRole),
      );
      return { success: true, user: userWithRole };
    } else {
      // Create a transient custom user if not found in pre-defined list, for ease of testing
      const nameParts = email.split("@")[0].split(".");
      const name = nameParts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
      const tempUser = {
        id: "u_temp_" + Date.now(),
        name: name || "Custom User",
        role: role || "Sales Representative",
        email: email,
        avatar: (name ? name.substring(0, 2) : "CU").toUpperCase(),
      };

      // Save newly registered rep into our dynamic user pool
      setAllUsers((prev) => [...prev, tempUser]);
      setCurrentUser(tempUser);
      setIsAuthenticated(true);
      localStorage.setItem("petsfolio_session_user", JSON.stringify(tempUser));
      return { success: true, user: tempUser };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("petsfolio_session_user");
  };

  const addSalesPerson = (name, email) => {
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Check if salesperson with same email of name already exists
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("A representative with this email already exists!");
    }

    const newUser = {
      id: "u_" + Date.now(),
      name,
      role: "Sales Representative",
      email,
      avatar: initials || "SR",
    };

    setAllUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteSalesPerson = (userId) => {
    // Prevent self-deletion if logged in
    if (currentUser && currentUser.id === userId) {
      throw new Error(
        "You cannot delete your own logged-in representative account!",
      );
    }
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        allUsers,
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
