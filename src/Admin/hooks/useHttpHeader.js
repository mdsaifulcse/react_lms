import useSession from "./useSession";
export default function useHttpHeader() {
  const { getToken } = useSession();

  const defaultHeadersForAdmin = (contentType) => {
    const token = getToken;
    const headers = {
      "Content-Type": contentType ? contentType : "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };
    return headers;
  };

  return {
    defaultHeadersForAdmin,
  };
}
