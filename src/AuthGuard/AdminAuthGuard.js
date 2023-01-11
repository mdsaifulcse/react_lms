import useSession from "../Admin/hooks/useSession";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { getJSON } from "jquery";
import { useState } from "react";

export default function AdminAuthGuard() {
  //const [token, setToken] = useState();
  //const navigate = useNavigate();
  const { getToken } = useSession();

  const token = getToken;

  return token ? <Outlet /> : <Navigate to="/" />;
}
