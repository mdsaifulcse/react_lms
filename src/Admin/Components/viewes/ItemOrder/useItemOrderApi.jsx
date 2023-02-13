import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
import { useQuery, useMutation } from "react-query";
import useToster from "../../../hooks/useToster";

export default function useItemApi() {
  const { onError, onSuccess } = useToster();
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  // const activeSubCategoriesByCategoryRequest = async ({ queryKey }) => {
  //   const categoryId = queryKey[1];
  //   const headers = await defaultHeadersForAdmin();
  //   const response = await axios(
  //     `${baseUrl}admin/sub-category-list/${categoryId}`,
  //     {
  //       method: "GET",
  //       headers,
  //     }
  //   );
  //   return response;
  // };

  // const activeThirdSubCategoriesBySubCategoryRequest = async ({ queryKey }) => {
  //   const subCategoryId = queryKey[1];
  //   const headers = await defaultHeadersForAdmin();
  //   const response = await axios(
  //     `${baseUrl}admin/active-third-sub-category-list/${subCategoryId}`,
  //     {
  //       method: "GET",
  //       headers,
  //     }
  //   );
  //   return response;
  // };

  // const activeCountryListRequest = async () => {
  //   const headers = await defaultHeadersForAdmin();
  //   const response = await axios(`${baseUrl}admin/active-country-list`, {
  //     method: "GET",
  //     headers,
  //   });
  //   return response;
  // };

  // const activeLanguageListRequest = async () => {
  //   const headers = await defaultHeadersForAdmin();
  //   const response = await axios(`${baseUrl}admin/active-language-list`, {
  //     method: "GET",
  //     headers,
  //   });
  //   return response;
  // };

  // const activeAuthorListRequest = async () => {
  //   const headers = await defaultHeadersForAdmin();
  //   const response = await axios(`${baseUrl}admin/active-author-list`, {
  //     method: "GET",
  //     headers,
  //   });
  //   return response;
  // };

  // const activePublisherListRequest = async () => {
  //   const headers = await defaultHeadersForAdmin();
  //   const response = await axios(`${baseUrl}admin/active-publisher-list`, {
  //     method: "GET",
  //     headers,
  //   });
  //   return response;
  // };

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
    const response = await axios(`${baseUrl}admin/item-order-no`, {
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

  const allItemsOrdersRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-orders`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createItemOrderRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/item-orders`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showItemOrderRequest = async ({ queryKey }) => {
    const authorId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-orders/${authorId}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateItemOrderRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/item-orders/${id}`, {
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

  const deleteItemOrderRequest = async (itemOrderId) => {
    console.log(itemOrderId);
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-orders/${itemOrderId}`, {
      method: "DELETE",
      headers,
    });
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
    activeVendorsRequest,
    allItemsOrdersRequest,
    createItemOrderRequest,
    showItemOrderRequest,
    updateItemOrderRequest,
    deleteItemOrderRequest,
  };
}
