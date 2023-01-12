import axios from "axios";
import useSession from "../../../hooks/useSession";
import config from "../../../Helper/config";
export default function useAuthorApi() {
  const { defaultHeadersForAdmin } = useSession();
  const baseUrl = config.baseUrl;

  const allAuthorsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/authors`, {
      method: "GET",
      headers,
    });
    return response;
  };

  return {
    allAuthorsRequest,
  };
}
