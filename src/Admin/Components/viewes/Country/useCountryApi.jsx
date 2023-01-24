import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useCountrieApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allCountrieRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/countries`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createCountryRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/countries`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showCountryRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/countries/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateCountryRequest = async (data, id) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/countries/${id}`, {
      //${authorId}
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const getCountryMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/country-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteCountryRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/countries/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    deleteCountryRequest,
    createCountryRequest,
    allCountrieRequest,
    showCountryRequest,
    updateCountryRequest,
    getCountryMaxSequence,
  };
}
