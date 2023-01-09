import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function useToster() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  var message = "";
  const onError = (error) => {
    if (error.response.status === 400) {
      message = error.response.data.errors;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (error.response.status === 401) {
      console.log(error);
      message = error.response.data.message;
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

  return { loading, onSuccess, onError };
}
