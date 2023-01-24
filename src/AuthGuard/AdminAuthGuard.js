import useSession from "../admin/hooks/useSession";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminAuthGuard() {
  //const [token, setToken] = useState();
  //const navigate = useNavigate();
  const { getToken } = useSession();

  const token = getToken;

  return token ? <Outlet /> : <Navigate to="/login/admin" />;
}
