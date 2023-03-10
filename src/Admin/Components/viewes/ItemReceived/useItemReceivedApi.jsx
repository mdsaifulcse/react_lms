import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";

export default function useItemReceivedApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const itemReceivedNoRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-received-num`, {
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

  const allItemsReceivedsRequest = async ({ queryKey }) => {
    const paymentStatus = queryKey[1];
    console.log(paymentStatus);
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/item-received?paymentStatus=${paymentStatus}`,
      {
        method: "GET",
        headers,
      }
    );
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

  const unreceivedOrderByOrderIdRequest = async ({ queryKey }) => {
    const itemOrderId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/unreceivedOrderByOrderId/${itemOrderId}`,
      {
        method: "GET",
        headers,
      }
    );
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

  const deleteItemReceivedRequest = async (receivedId) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/item-received/${receivedId}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return response;
  };

  return {
    itemReceivedNoRequest,
    activeVendorsRequest,
    allItemsReceivedsRequest,
    createItemReceivedRequest,
    unreceivedOrderByOrderIdRequest,
    showItemReceivedRequest,
    deleteItemReceivedRequest,
  };
}
