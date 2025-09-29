"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "@/utils/axios";

interface User {
  _id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  photo: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    userData: Omit<User, "_id"> & { password: string }
  ) => Promise<boolean>;
  fetchUserById: (userId: string) => Promise<User | null>;
  refreshUser: () => Promise<void>;
  switchUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    console.log("User logged out successfully");
  }, []);

  const fetchUserById = useCallback(
    async (userId: string): Promise<User | null> => {
      try {
        const response = await axiosInstance.get(`/user/get-user/${userId}`);
        if (response.data.success) {
          return response.data.user;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        // If user not found or error, clear authentication
        logout();
        return null;
      }
    },
    [logout]
  );

  useEffect(() => {
    // Check for stored authentication on mount
    const storedUserId = localStorage.getItem("userId");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUserId && storedAuth === "true") {
      // Fetch user details by ID
      fetchUserById(storedUserId).then((userData) => {
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // If user not found, clear stored data
          localStorage.removeItem("userId");
          localStorage.removeItem("isAuthenticated");
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fetchUserById]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("userId", userData._id);
    localStorage.setItem("isAuthenticated", "true");
    console.log("User logged in successfully:", userData.email);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user?._id) {
      const userData = await fetchUserById(user._id);
      if (userData) {
        setUser(userData);
        console.log("User data refreshed for:", userData.email);
      } else {
        // If user not found, logout
        logout();
      }
    }
  }, [user?._id, fetchUserById, logout]);

  const switchUser = useCallback(
    (newUser: User) => {
      // Clear current user data
      logout();
      // Set new user data
      login(newUser);
      console.log("Switched to user:", newUser.email);
    },
    [login, logout]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        // Clear any existing user data first
        logout();

        const response = await axiosInstance.post("/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          const userData = response.data.user;
          login(userData);
          console.log("Sign in successful for:", userData.email);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    [login, logout]
  );

  const signUp = useCallback(
    async (
      userData: Omit<User, "_id"> & { password: string }
    ): Promise<boolean> => {
      try {
        // Clear any existing user data first
        logout();

        const response = await axiosInstance.post(
          "/user/create-user",
          userData
        );

        if (response.data.success) {
          const newUser = response.data.user;
          login(newUser);
          console.log("Sign up successful for:", newUser.email);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Sign up error:", error);
        return false;
      }
    },
    [login, logout]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        signIn,
        signUp,
        fetchUserById,
        refreshUser,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
