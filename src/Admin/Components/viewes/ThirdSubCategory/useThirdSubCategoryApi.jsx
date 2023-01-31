import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useThirdSubCategoryApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allThirdSubCategoriesRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/third-sub-categories`, {
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

  const createThirdSubCategoryRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/third-sub-categories`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showThirdSubCategoryRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/third-sub-categories/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateThirdSubCategoryRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(
        `${baseUrl}admin/third-sub-categories/${id}`,
        {
          //${authorId}
          method: "POST",
          headers,
          data: data,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const getThirdSubCategoryMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/third-sub-categories-max-sequence`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const deleteThirdSubCategoryRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/third-sub-categories/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    activeSubCategoriesByCategoryRequest,
    activeCategoriesRequest,
    allThirdSubCategoriesRequest,
    createThirdSubCategoryRequest,
    showThirdSubCategoryRequest,
    updateThirdSubCategoryRequest,
    getThirdSubCategoryMaxSequence,
    deleteThirdSubCategoryRequest,
  };
}
