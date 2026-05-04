import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          // Attempt to fetch fresh profile data on load
          // apiClient will handle silent refresh if the token is expired
          await fetchProfile();
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiClient("/api/v1/customer/profile");
      const userData = data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Fetch profile error:", error);
      // If unauthorized, logout
      if (error.message?.includes("unauthorized") || error.status === 401) {
        logout();
      }
    }
  };

  const updateProfile = async (fullName) => {
    try {
      const data = await apiClient("/api/v1/customer/update-profile", {
        method: "PATCH",
        body: JSON.stringify({ fullName }),
      });
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiClient("/api/v1/customer/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role: 3 }),
      });
      
      const userData = data.data.customer || data.data.user || data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const data = await apiClient("/api/v1/customer/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const data = await apiClient("/api/v1/customer/google-login", {
        method: "POST",
        body: JSON.stringify({ tokenID: credential }),
      });
      
      const userData = data.data.customer || data.data.user || data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const sendOtp = async (email) => {
    try {
      const data = await apiClient("/api/v1/customer/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const data = await apiClient("/api/v1/customer/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      const userData = data.data.customer || data.data.user || data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient("/api/v1/customer/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
