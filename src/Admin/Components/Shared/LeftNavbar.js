import { Link, NavLink } from "react-router-dom";
export default function LeftNavbar() {
  return (
    <nav className="pcoded-navbar" pcoded-header-position="absolute">
      <div className="sidebar_toggle">
        <Link to="#">
          <i className="icon-close icons"></i>
        </Link>
      </div>
      <div className="pcoded-inner-navbar main-menu">
        <div className="">
          <div className="main-menu-header">
            {/* <img className="img-40" src="assets/images/user.png" alt="User-Profile-Image"> */}
            <div className="user-details">
              <span>John Doe</span>
              <span id="more-details">
                UX Designer<i className="ti-angle-down"></i>
              </span>
            </div>
          </div>

          <div className="main-menu-content">
            <ul>
              <li className="more-details">
                <NavLink to="user-profile.html">
                  <i className="ti-user"></i>View Profile
                </NavLink>
                <Link to="sdfsd">
                  <i className="ti-settings"></i>Settings
                </Link>
                <Link to="#!">
                  <i className="ti-layout-sidebar-left"></i>Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="pcoded-navigatio-lavel"
          data-i18n="nav.category.navigation"
          menu-title-theme="theme5"
        >
          Navigation
        </div>
        <ul className="pcoded-item pcoded-left-item">
          {/* Page layouts */}
          <li className="pcoded-hasmenu">
            <Link to="#">
              <span className="pcoded-micon">
                <i className="ti-layout"></i>
              </span>
              <span className="pcoded-mtext" data-i18n="nav.page_layout.main">
                Page layouts
              </span>
              <span className="pcoded-badge label label-warning">NEW</span>
              <span className="pcoded-mcaret"></span>
            </Link>
            <ul className="pcoded-submenu">
              <li className=" pcoded-hasmenu">
                <Link to="#!">
                  <span className="pcoded-micon">
                    <i className="icon-pie-chart"></i>
                  </span>
                  <span className="pcoded-mtext">Author</span>
                  <span className="pcoded-mcaret"></span>
                </Link>
                <ul className="pcoded-submenu">
                  <li className="">
                    <NavLink to="/admin/authors">
                      <span className="pcoded-micon">
                        <i className="icon-chart"></i>
                      </span>
                      <span className="pcoded-mtext">List</span>
                      <span className="pcoded-mcaret"></span>
                    </NavLink>
                  </li>
                  <li className="">
                    <NavLink to="/admin/authors/create">
                      <span className="pcoded-micon">
                        <i className="icon-chart"></i>
                      </span>
                      <span className="pcoded-mtext">Create</span>
                      <span className="pcoded-mcaret"></span>
                    </NavLink>
                  </li>
                  <li className="">
                    <NavLink to="/admin/authors/show">
                      <span className="pcoded-micon">
                        <i className="icon-chart"></i>
                      </span>
                      <span className="pcoded-mtext">Show</span>
                      <span className="pcoded-mcaret"></span>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className=" ">
                <Link to="dashboard">
                  <img
                    className="img-fluid"
                    src="assets/images/logo.png"
                    alt="Theme-Logo"
                  />
                </Link>
                <NavLink to="user-list">
                  <span className="pcoded-micon">
                    <i className="icon-pie-chart"></i>
                  </span>
                  <span className="pcoded-mtext">User List</span>
                  <span className="pcoded-mcaret"></span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
