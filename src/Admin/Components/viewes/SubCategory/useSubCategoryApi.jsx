import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useSubCategoryApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allSubCategoriesRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/sub-categories`, {
      method: "GET",
      headers,
    });
    return response;
  };
  const activeCategoriesRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/category-list`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createSubCategoryRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/sub-categories`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showSubCategoryRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/sub-categories/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateSubCategoryRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/sub-categories/${id}`, {
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

  const getSubCategoryMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/sub-category-max-sequence`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const deleteSubCategoryRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/sub-categories/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    activeCategoriesRequest,
    allSubCategoriesRequest,
    createSubCategoryRequest,
    showSubCategoryRequest,
    updateSubCategoryRequest,
    getSubCategoryMaxSequence,
    deleteSubCategoryRequest,
  };
}
