import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
import { useQuery, useMutation } from "react-query";
import useToster from "../../../hooks/useToster";

export default function useItemApi() {
  const { onError, onSuccess } = useToster();
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const activeCategoriesRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/category-list`, {
      method: "GET",
      headers,
    });
    return response;
  };
  const activeSubCategoriesByCategoryRequest = async ({ queryKey }) => {
    const categoryId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/sub-category-list/${categoryId}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const activeThirdSubCategoriesBySubCategoryRequest = async ({ queryKey }) => {
    const subCategoryId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/active-third-sub-category-list/${subCategoryId}`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const activeCountryListRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-country-list`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const activeLanguageListRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-language-list`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const activeAuthorListRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-author-list`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const useActiveAuthorListRequest = () => {
    return useQuery("activeAuthorListRequest", activeAuthorListRequest, {
      //onSuccess: async (response) => {},
      onError: onError,
      refetchOnWindowChange: false,
    });
  };

  const activePublisherListRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-publisher-list`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const allItemsRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/items`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const itemsInventoryStockRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/items-inventory-stock`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createItemRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/items`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showItemRequest = async ({ queryKey }) => {
    const authorId = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/items/${authorId}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateItemRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/items/${id}`, {
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

  const getItemMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/item-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteItemRequest = async (itemId) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/items/${itemId}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    activeCountryListRequest,
    activeLanguageListRequest,
    activeAuthorListRequest,
    activePublisherListRequest,
    activeCategoriesRequest,
    activeSubCategoriesByCategoryRequest,
    activeThirdSubCategoriesBySubCategoryRequest,
    deleteItemRequest,
    createItemRequest,
    itemsInventoryStockRequest,
    allItemsRequest,
    showItemRequest,
    updateItemRequest,
    getItemMaxSequence,
  };
}
