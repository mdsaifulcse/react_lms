import { toast } from "react-toastify";
import { useState } from "react";
import useSession from "./useSession";

export default function useToster() {
  const { removeToken } = useSession();
  const [successMessage, setSuccessMessage] = useState(null);

  const onError = (error) => {
    var message = "";
    if (error.response.status === 400) {
      message = error.response.data.errors;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (error.response.status === 401) {
      message = error.response.data.message;
      removeToken(error);
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (error.response.status === 404) {
      message = error.response.data.message + " Api Not Found";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const onSuccess = (res) => {
    if (res.status === 200) {
      setSuccessMessage(res.data.message);
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return { onSuccess, onError };
}
