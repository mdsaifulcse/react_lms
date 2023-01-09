import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function useSession() {
  const [loading, setLoading] = useState(false);

  const setToken = (res) => {
    if (res.status === 200) {
      localStorage.setItem("lms-access-token", res.data.access_token);
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };
  const getToken = (tokenName) => {
    console.log("123456");
    localStorage.getItem(tokenName);
  };

  return { loading, getToken, setToken };
}
