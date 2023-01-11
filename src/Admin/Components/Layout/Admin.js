import HeaderNav from "../Shared/HeaderNavBar";
import RightSidebar from "../Shared/RightSidebar";
import LeftNavbar from "../Shared/LeftNavbar";
import PageHeader from "../Shared/PageHeader";
import { Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { useAuth } from "../../Contexts/AuthContext";
import useToster from "../../hooks/useToster";
import { useState } from "react";
//import { Axios } from "axios";
//import { useEffect } from "react";

export default function Admin() {
  // const { logOut } = useAuth();
  // const { onError, onSuccess } = useToster();
  // const [allowedToFetch, setAllowedToFetch] = useState(false);

  // const { data, status, isLoading, isError, refetch, isFetching } = useQuery(
  //   "admin-logout",
  //   logOut,
  //   {
  //     enabled: false,
  //     onSuccess: onSuccess,
  //     onError: onError,
  //   }
  // );

  // console.log(isLoading);

  return (
    <>
      {/* <!-- Pre-loader start --> */}
      {/* <div className="theme-loader">
        <div className="ball-scale">
          <div></div>
        </div>
      </div> */}
      {/* <!-- Pre-loader end -->
    <!-- Menu header start --> */}
      <div id="pcoded" className="pcoded">
        <div className="pcoded-overlay-box"></div>
        <div className="pcoded-container navbar-wrapper">
          {/* Header Navbar */}
          <HeaderNav />

          {/* <!--Right Sidebar chat start --> */}
          <RightSidebar />

          {/* <!-- Sidebar inner chat start--> */}

          {/* <!-- Sidebar inner chat end--> */}

          <div className="pcoded-main-container">
            <div className="pcoded-wrapper">
              {/* <!-- LeftNavbar--> */}
              <LeftNavbar />
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      {/* Page header */}
                      <PageHeader />
                      <div className="page-body">
                        <Outlet />
                      </div>
                    </div>

                    <div id="styleSelector"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
