import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useLanguageApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allLanguagesRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/languages`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createLanguageRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/languages`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showLanguageRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/languages/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateLanguageRequest = async (data, id) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/languages/${id}`, {
      //${authorId}
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const getLanguageMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/language-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteLanguageRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/languages/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    allLanguagesRequest,
    createLanguageRequest,
    showLanguageRequest,
    updateLanguageRequest,
    getLanguageMaxSequence,
    deleteLanguageRequest,
  };
}
