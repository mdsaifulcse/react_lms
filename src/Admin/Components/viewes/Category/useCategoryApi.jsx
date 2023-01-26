import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useCategoryApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allCategoriesRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/categories`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createCategoryRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/categories`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showCategoryRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/categories/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateCategoryRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/categories/${id}`, {
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

  const getCategoryMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/category-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteCategoryRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/categories/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    allCategoriesRequest,
    createCategoryRequest,
    showCategoryRequest,
    updateCategoryRequest,
    getCategoryMaxSequence,
    deleteCategoryRequest,
  };
}
