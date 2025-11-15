// Style Laoding User
import * as U from "./auth.context.style";
import { Loader } from "lucide-react";

// Context
import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle Login - only store token, get user from database
  const login = async (token) => {
    try {
      // Store only the token
      localStorage.setItem("token", token);

      // Get fresh user data from database
      const response = await makeRequest.get("/auth/profile");

      if (response.data.status === "success") {
        setCurrentUser(response.data.data);
      } else {
        throw new Error("Failed to get user data");
      }
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      setCurrentUser(null);
      throw error;
    }
  };

  // Handle Logout
  const logout = async () => {
    try {
      await makeRequest.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Only remove token, no user data stored
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  };

  // Check if user is authenticated - only check token, get user from database
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Always get fresh user data from database
          const response = await makeRequest.get("/auth/profile");

          if (response.data.status === "success") {
            // Set user data from database response
            setCurrentUser(response.data.data);
          } else {
            console.error("Auth check failed:", response.data.errors);
            localStorage.removeItem("token");
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);

          // If token is invalid, remove it
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } else {
        // No token, user is not authenticated
        setCurrentUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Refresh user data from database
  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await makeRequest.get("/auth/profile");

        if (response.data.status === "success") {
          setCurrentUser(response.data.data);
          return response.data.data;
        }
      } catch (error) {
        console.error("Refresh user failed:", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    }
    return null;
  };

  // Loading
  if (loading) {
    return (
      <U.LoadingContainer>
        <Loader size={50} />
        <p>Loading User...</p>
      </U.LoadingContainer>
    );
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
