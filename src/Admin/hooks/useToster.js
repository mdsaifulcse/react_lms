import { toast } from "react-toastify";
import useSession from "./useSession";

export default function useToster() {
  const { removeToken } = useSession();

  const onError = async (error) => {
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
      message = error.response.data.message + " Or Api Not Found";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (error.response.status === 500) {
      message = error.response.data.message;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const onSuccess = async (res) => {
    if (res.status === 200) {
      // await setSuccessMessage(res.data.message);
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const customOnSuccess = async (customMessage) => {
    toast.success(customMessage, {
      position: "top-right",
      autoClose: 5000,
    });
  };

  return { onSuccess, onError, customOnSuccess };
}
