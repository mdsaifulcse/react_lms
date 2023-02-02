import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
import { useQuery, useMutation } from "react-query";
import useToster from "../../../hooks/useToster";

const activeAuthorListRequest = async () => {
  const headers = await defaultHeadersForAdmin();
  console.log("123");
  const response = await axios(`${baseUrl}admin/active-author-list`, {
    method: "GET",
    headers,
  });
  return response;
};

const useActiveAuthorListRequest = (onSuccess, onError) => {
  return useQuery("activeAuthorListRequest", activeAuthorListRequest, {
    onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowChange: false,
  });
};
