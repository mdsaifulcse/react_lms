import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useUserUserMembershipPlanApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allGeneralUsersRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-general-users`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const activeMembershipPlansRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/active-membership-plan`, {
      method: "GET",
      headers,
    });
    return response;
  };
  const allUserMembershipPlansRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/user-membership`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createUserMembershipPlanRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/user-membership`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showUserMembershipPlanRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/user-membership/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateUserMembershipPlanRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/user-membership/${id}`, {
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

  const deleteUserMembershipPlanRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/user-membership/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    allGeneralUsersRequest,
    activeMembershipPlansRequest,
    allUserMembershipPlansRequest,
    createUserMembershipPlanRequest,
    showUserMembershipPlanRequest,
    updateUserMembershipPlanRequest,
    deleteUserMembershipPlanRequest,
  };
}
