import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../Helper/config";
export default function useAuthorApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const createAuthorRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/authors`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const allAuthorsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/authors`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const getAuthorMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/author-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteAuthorsRequest = async (authorId) => {
    console.log(authorId);
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/authors/${authorId}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    deleteAuthorsRequest,
    createAuthorRequest,
    allAuthorsRequest,
    getAuthorMaxSequence,
  };
}
