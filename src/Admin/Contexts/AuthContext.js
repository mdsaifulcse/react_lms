import React, { useContext } from "react";
import axios from "axios";
import config from "../Helper/config";
import useSession from "../hooks/useSession";
import useHttpHeader from "../hooks/useHttpHeader";

const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const baseUrl = config.baseUrl;
  const { getUserDetails } = useSession();
  const { defaultHeadersForAdmin } = useHttpHeader();

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
