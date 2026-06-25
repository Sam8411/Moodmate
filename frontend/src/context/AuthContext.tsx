"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type UserProfile = {
  id: number;
  name: String;
  email: String;
  role: String;
  profileImage?: String;
  badges: String;
  points: number;
};

type AuthContextType = {
  user: UserProfile | null;
  token: String | null;
  loading: boolean;
  loginUser: (userData: UserProfile, token: String) => void;
  logoutUser: () => void;
  updateUserPoints: (points: number, badges?: String) => void;
  updateUserProfile: (name: String, profileImage?: String) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<String | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("moodmate_token");
    const savedUser = localStorage.getItem("moodmate_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = useCallback((userData: UserProfile, jwtToken: String) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem("moodmate_token", jwtToken.toString());
    localStorage.setItem("moodmate_user", JSON.stringify(userData));
  }, []);

  const logoutUser = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("moodmate_token");
    localStorage.removeItem("moodmate_user");
  }, []);

  const updateUserPoints = useCallback((points: number, badges?: String) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = {
        ...prevUser,
        points: prevUser.points + points,
        badges: badges !== undefined ? badges : prevUser.badges,
      };
      localStorage.setItem("moodmate_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateUserProfile = useCallback((name: String, profileImage?: String) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = {
        ...prevUser,
        name,
        profileImage: profileImage !== undefined ? profileImage : prevUser.profileImage,
      };
      localStorage.setItem("moodmate_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        updateUserPoints,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
