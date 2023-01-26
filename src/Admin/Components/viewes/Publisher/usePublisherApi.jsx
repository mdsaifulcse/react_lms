import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function usePublisherApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allPublisherRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/publishers`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createPublisherRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/publishers`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showPublisherRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/publishers/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updatePublisherRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/publishers/${id}`, {
        //${authorId}
        method: "POST",
        headers,
        data: data,
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  const getPublisherMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/publisher-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deletePublisherRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/publishers/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    deletePublisherRequest,
    createPublisherRequest,
    allPublisherRequest,
    showPublisherRequest,
    updatePublisherRequest,
    getPublisherMaxSequence,
  };
}
