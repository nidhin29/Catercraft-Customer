import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (could be a /verify-token endpoint)
    // For now, we'll check localStorage for basic persistence
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient("/login", {
        method: "POST",
        body: JSON.stringify({ email, password, user_type: 3 }),
      });
      
      const userData = data.data.user || data.data; // Depending on backend structure
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const data = await apiClient("/register-customer", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user?.email) {
        await apiClient("/api/UserLogout", {
          method: "POST",
          body: JSON.stringify({ email: user.email }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
