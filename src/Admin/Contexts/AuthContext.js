import React, { useContext, useState } from "react";
import axios from "axios";
import config from "../Helper/config";
import { toast } from "react-toastify";

const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const baseUrl = config.baseUrl;

  const login = async ({ username, password }) => {
    const response = await axios(`${baseUrl}admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { username, password },
    });
    return response;
  };

  async function singUP(data) {}
  async function logOut(username, password) {}
  async function getToken(tokenName) {}
  async function setToken(tokenName, token) {}

  function removeSessions() {
    localStorage.clear();
    window.location.href = "/";
  }

  const value = {
    currentUser,
    login,
    singUP,
    logOut,
    getToken,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
