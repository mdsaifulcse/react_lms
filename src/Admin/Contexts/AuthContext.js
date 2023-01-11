import React, { useContext, useState } from "react";
import axios from "axios";
import config from "../Helper/config";
import { toast } from "react-toastify";
import useSession from "../hooks/useSession";

const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const baseUrl = config.baseUrl;
  const { getToken, defaultHeadersForAdmin, getUserDetails } = useSession();

  const login = async ({ username, password }) => {
    const headers = await defaultHeadersForAdmin();

    const response = await axios(`${baseUrl}admin/login`, {
      method: "POST",
      headers,
      data: { username, password },
    });
    return response;
  };

  async function singUP(data) {}

  const logOut = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/logout`, {
      method: "POST",
      headers,
    });
    return response;
  };

  const currentUser = getUserDetails;

  const value = {
    currentUser,
    login,
    singUP,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
