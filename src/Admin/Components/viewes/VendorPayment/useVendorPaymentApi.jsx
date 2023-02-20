import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";

export default function useVendorPaymentApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const itemVendorPaymentNumRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/vendor-payment-num`, {
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

  const allVendorPaymentsRequest = async ({ queryKey }) => {
    const paymentStatus = queryKey[1];
    console.log(paymentStatus);
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/vendor-payments?paymentStatus=${paymentStatus}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const createVendorPaymentRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/vendor-payments`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const payableReceivedOrderByReceivedId = async ({ queryKey }) => {
    const itemReceivedId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/payableReceivedOrderByReceivedId/${itemReceivedId}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const showVendorPaymentRequest = async ({ queryKey }) => {
    const itemOrderId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/vendor-payments/${itemOrderId}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const deleteVendorPaymentRequest = async (vendorId) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/vendor-payments/${vendorId}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return response;
  };

  return {
    itemVendorPaymentNumRequest,
    activeVendorsRequest,
    allVendorPaymentsRequest,
    createVendorPaymentRequest,
    payableReceivedOrderByReceivedId,
    showVendorPaymentRequest,
    deleteVendorPaymentRequest,
  };
}
