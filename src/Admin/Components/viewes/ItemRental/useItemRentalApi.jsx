import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
import { useQuery, useMutation } from "react-query";
import useToster from "../../../hooks/useToster";

export default function useItemRentalApi() {
  const { onError, onSuccess } = useToster();
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
  const itemOrderNoRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-rental-num`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const activeGenralsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-general-users`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const allItemRentalsRequest = async ({ queryKey }) => {
    const orderStatus = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      // `${baseUrl}admin/item-rentals?order_status=${orderStatus}`,
      `${baseUrl}admin/item-rentals`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const createItemRentalRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/item-rentals`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showItemRentalRequest = async ({ queryKey }) => {
    const itemOrderId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/item-rentals/${itemOrderId}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const updateItemRentalRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/item-rentals/${id}`, {
        method: "POST",
        headers,
        data: data,
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  const deleteItemRentalRequest = async (itemOrderId) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/item-rentals/${itemOrderId}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return response;
  };

  return {
    // activeCountryListRequest,
    // activeLanguageListRequest,
    // activeAuthorListRequest,
    // activePublisherListRequest,
    // activeCategoriesRequest,
    // activeSubCategoriesByCategoryRequest,
    // activeThirdSubCategoriesBySubCategoryRequest,

    activeItemSearch,
    itemOrderNoRequest,
    activeGenralsRequest,
    allItemRentalsRequest,
    createItemRentalRequest,
    showItemRentalRequest,
    updateItemRentalRequest,
    deleteItemRentalRequest,
  };
}
