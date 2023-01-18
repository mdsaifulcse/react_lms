import { toast } from "react-toastify";
import { useState } from "react";

export default function useSession() {
  const [currentUser, setCurrentUser] = useState();
  const authUser = currentUser;

  const setToken = (res) => {
    if (res.status === 200) {
      localStorage.setItem("lms-access-token", res.data.access_token);
      setCurrentUser(res.data.user);
      setUserDetails(res);
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const setUserDetails = async (resData) => {
    const userData = {
      name: resData.data.user.name,
      profile_photo_url: resData.data.user.profile_photo_url,
      email: resData.data.user.email,
      status: resData.data.user.status,
    };

    localStorage.setItem("UserDetails", JSON.stringify(userData));
  };

  const getUserDetails = JSON.parse(localStorage.getItem("UserDetails"));

  const removeToken = (res) => {
    localStorage.clear();
    window.location.href = "/login/admin"; // Redirect to login for admin ---------
    toast.success(res.data.message, {
      position: "top-right",
      autoClose: 5000,
    });
  };

  const getToken = localStorage.getItem("lms-access-token");

  return {
    authUser,
    getToken,
    setToken,
    removeToken,
    setUserDetails,
    getUserDetails,
  };
}
