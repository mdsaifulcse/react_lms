import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";

export default function useItemReceivedApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const activeItemSearch = async ({ queryKey }) => {
    const searchQuery = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/active-item-search?q=${searchQuery}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };
  const itemReceivedNoRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-received-no`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const activeVendorsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-vendors-list`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const allItemsReceivedsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-received`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createItemReceivedRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/item-received`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showItemReceivedRequest = async ({ queryKey }) => {
    const itemOrderId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/item-received/${itemOrderId}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const updateItemReceivedRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/item-received/${id}`, {
        method: "POST",
        headers,
        data: data,
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  const deleteItemReceivedRequest = async (itemOrderId) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/item-received/${itemOrderId}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return response;
  };

  return {
    activeItemSearch,
    itemReceivedNoRequest,
    activeVendorsRequest,
    allItemsReceivedsRequest,
    createItemReceivedRequest,
    showItemReceivedRequest,
    updateItemReceivedRequest,
    deleteItemReceivedRequest,
  };
}
