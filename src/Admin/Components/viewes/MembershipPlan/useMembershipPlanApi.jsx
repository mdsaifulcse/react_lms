import axios from "axios";
import httpHeaders from "../../../hooks/useHttpHeader";
import config from "../../../helper/config";
export default function useMembershipPlanApi() {
  const { defaultHeadersForAdmin } = httpHeaders();
  const baseUrl = config.baseUrl;

  const allMembershipPlansRequest = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/membership-plans`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const createMembershipPlanRequest = async (data) => {
    const headers = await defaultHeadersForAdmin("multipart/form-data");
    const response = await axios(`${baseUrl}admin/membership-plans`, {
      method: "POST",
      headers,
      data: data,
    });
    return response;
  };

  const showMembershipPlanRequest = async ({ queryKey }) => {
    const id = queryKey[1];
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/membership-plans/${id}`, {
      method: "GET",
      headers,
    });
    return response;
  };

  const updateMembershipPlanRequest = async (data, id) => {
    try {
      const headers = await defaultHeadersForAdmin("multipart/form-data");
      const response = await axios(`${baseUrl}admin/membership-plans/${id}`, {
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

  const getMembershipPlanMaxSequence = async () => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(
      `${baseUrl}admin/membership-plans-max-sequence`,
      {
        method: "GET",
        headers,
      }
    );
    return response;
  };

  const deleteMembershipPlanRequest = async (id) => {
    const headers = await defaultHeadersForAdmin();
    const response = await axios(`${baseUrl}admin/membership-plans/${id}`, {
      method: "DELETE",
      headers,
    });
    return response;
  };

  return {
    allMembershipPlansRequest,
    createMembershipPlanRequest,
    showMembershipPlanRequest,
    updateMembershipPlanRequest,
    getMembershipPlanMaxSequence,
    deleteMembershipPlanRequest,
  };
}
