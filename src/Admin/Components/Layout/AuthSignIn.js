import { Link, redirect, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, queryClient } from "react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../Contexts/AuthContext";
import useToster from "../../hooks/useToster";
import useSession from "../../hooks/useSession";

export default function AuthSignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [error, setError] = useState(null);

  // const fetchCategoy = () => {
  //   return axios.get(apiUrl + "admin/test-data").then((res) => res.data);
  // };

  // const { data, isLoading, isError, refetch } = useQuery(
  //   ["catData"],
  //   fetchCategoy
  // );

  // const adminLogin = async (postData) => {
  //   const response = await axios(`${apiUrl}admin/login`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: postData,
  //   });
  //   //  console.log(response);
  //   return response;
  // };
  const { login } = useAuth();
  const { onError, onSuccess } = useToster();
  const { setToken } = useSession();

  const { mutateAsync, isError, error, isLoading } = useMutation(login, {
    onSuccess: setToken,
    onError: onError,
    onSettled: () => {
      queryClient.invalidateQueries("admin/login");
    },
  });

  //localStorage.setItem("lms-access_token", res.data.access_token);

  async function handleSubmit(e) {
    e.preventDefault();

    // if (username === "") {
    //   return setError("Username and password are required");
    // }
    // if (password === " ") {
    //   return setError("Username and password are required");
    // }

    await mutateAsync({ username, password });

    //return navigate("/dashboard");
  }

  return (
    <section className="login p-fixed d-flex text-center bg-primary common-img-bg">
      {/* <!-- Container-fluid starts --> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            {/* <!-- Authentication card start --> */}
            <div className="login-card card-block auth-body">
              <form className="md-float-material" onSubmit={handleSubmit}>
                <div className="text-center">
                  <img src="assets/images/auth/logo.png" alt="logo.png" />
                </div>
                <div className="auth-box">
                  <div className="row m-b-20">
                    <div className="col-md-12">
                      <h3 className="text-left txt-primary">Sign In</h3>
                    </div>
                  </div>
                  <hr />
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Email Address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="md-line"></span>
                  </div>
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="md-line"></span>
                  </div>
                  <div className="row m-t-25 text-left">
                    <div className="col-sm-7 col-xs-12">
                      <div className="checkbox-fade fade-in-primary">
                        <label>
                          <input type="checkbox" />
                          <span className="cr">
                            <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                          </span>
                          <span className="text-inverse">Remember me</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-5 col-xs-12 forgot-phone text-right">
                      <a
                        href="forgot-password.html"
                        className="text-right f-w-600 text-inverse"
                      >
                        {" "}
                        Forgot Your Password?
                      </a>
                    </div>
                  </div>
                  <div className="row m-t-30">
                    <div className="col-md-12">
                      <button
                        type="submit"
                        className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-10">
                      <p className="text-inverse text-left m-b-0">
                        Thank you and enjoy our website.
                      </p>
                      <p className="text-inverse text-left">
                        <b>Your Autentification Team</b>
                      </p>
                    </div>
                    <div className="col-md-2">
                      <img
                        src="assets/images/auth/Logo-small-bottom.png"
                        alt="small-logo.png"
                      />
                    </div>
                  </div>
                </div>
              </form>
              {/* <!-- end of form --> */}
            </div>
            {/* <!-- Authentication card end --> */}
          </div>
          {/* <!-- end of col-sm-12 --> */}
        </div>
        {/* <!-- end of row --> */}
      </div>
      {/* <!-- end of container-fluid --> */}
    </section>
  );
}
