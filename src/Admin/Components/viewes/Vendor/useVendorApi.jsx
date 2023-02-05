import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useVendorApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allVendorsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/vendors`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createVendorRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/vendors`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showVendorRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/vendors/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateVendorRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/vendors/${id}`, {
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

  const getVendorMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/vendor-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteVendorRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/vendors/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    allVendorsRequest,
    createVendorRequest,
    showVendorRequest,
    updateVendorRequest,
    getVendorMaxSequence,
    deleteVendorRequest,
  };
}
