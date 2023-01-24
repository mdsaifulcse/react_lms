import HeaderNav from "../shared/HeaderNavBar";
import RightSidebar from "../shared/RightSidebar";
import LeftNavbar from "../shared/LeftNavbar";
import { Outlet } from "react-router-dom";
//import { Axios } from "axios";
//import { useEffect } from "react";

export default function AdminLayout() {
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
