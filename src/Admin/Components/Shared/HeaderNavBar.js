import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import useToster from "../../hooks/useToster";
import { useState } from "react";
import useSession from "../../hooks/useSession";
import Loading from "../Ui-Component/Loading";
export default function HeaderNav() {
  const { logOut, currentUser } = useAuth();
  const { removeToken, getUserDetails } = useSession();
  const { onError, onSuccess } = useToster();
  const [allowedToFetch, setAllowedToFetch] = useState(false);

  const auth = currentUser;

  const { data, status, isLoading, isError, refetch, isFetching } = useQuery(
    "admin-logout",
    logOut,
    {
      enabled: allowedToFetch,
      onSuccess: removeToken,
      onError: onError,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  async function handleLogout() {
    refetch();
    // removeToken();
  }

  return (
    <nav className="navbar header-navbar pcoded-header" header-theme="theme4">
      <div className="navbar-wrapper">
        <div className="navbar-logo">
          <Link className="mobile-menu" id="mobile-collapse" to="#!">
            <i className="ti-menu"></i>
          </Link>
          <Link className="mobile-search morphsearch-search" to="#">
            <i className="ti-search"></i>
          </Link>
          <Link to="/admin/dashboard">
            <img
              className="img-fluid"
              src="assets/images/logo.png"
              alt="Theme-Logo"
            />
          </Link>
          <Link className="mobile-options">
            <i className="ti-more"></i>
          </Link>
        </div>
        <div className="navbar-container container-fluid">
          <div>
            <ul className="nav-left">
              <li>
                <div className="sidebar_toggle">
                  <Link to="#">
                    <i className="ti-menu"></i>
                  </Link>
                </div>
              </li>
              <li>
                <Link className="main-search morphsearch-search" to="#">
                  {/* <!-- themify icon --> */}
                  <i className="ti-search"></i>
                </Link>
              </li>
              <li>
                <Link to="#!">
                  <i className="ti-fullscreen"></i>
                </Link>
              </li>
              <li className="mega-menu-top">
                <Link to="#">
                  Mega
                  <i className="ti-angle-down"></i>
                </Link>
                <ul className="show-notification row">
                  <li className="col-sm-3">
                    <h6 className="mega-menu-title">Popular Links</h6>
                    <ul className="mega-menu-links">
                      <li>
                        <Link to="form-elements-component.html">
                          Form Elements 1
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className="nav-right">
              <li className="header-notification lng-dropdown">
                <Link to="#" id="dropdown-active-item">
                  <i className="flag-icon flag-icon-gb m-r-5"></i> English
                </Link>
                <ul className="show-notification">
                  <li>
                    <Link to="#" data-lng="en">
                      <i className="flag-icon flag-icon-gb m-r-5"></i> English
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="header-notification">
                <Link to="#!">
                  <i className="ti-bell"></i>
                  <span className="badge">5</span>
                </Link>
                <ul className="show-notification">
                  <li>
                    <h6>Notifications</h6>
                    <label className="label label-danger">New</label>
                  </li>

                  <li>
                    <div className="media">
                      {/* <img className="d-flex align-self-center" src="assets/images/user.png" alt="Generic placeholder image"> */}
                      <div className="media-body">
                        <h5 className="notification-user">Sara Soudein</h5>
                        <p className="notification-msg">
                          Lorem ipsum dolor sit amet, consectetuer elit.
                        </p>
                        <span className="notification-time">
                          30 minutes ago
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="header-notification">
                <Link to="#!" className="displayChatbox">
                  <i className="ti-comments"></i>
                  <span className="badge">9</span>
                </Link>
              </li>
              <li className="user-profile header-notification">
                <Link to="#!">
                  {/* <img src="assets/images/user.png" alt="User-Profile-Image"> */}
                  <span>{auth.name} </span>
                  <i className="ti-angle-down"></i>
                </Link>
                <ul className="show-notification profile-notification">
                  <li>
                    <Link to="#!">
                      <i className="ti-settings"></i> Settings
                    </Link>
                  </li>
                  <li>
                    <Link to="#" onClick={handleLogout}>
                      {/* <Link to="#" onClick={() => refetch()}> */}
                      <i className="ti-logout"></i> Log out
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            {/* <!-- search --> */}
            <div id="morphsearch" className="morphsearch">
              <form className="morphsearch-form">
                <input
                  className="morphsearch-input"
                  type="search"
                  placeholder="Search..."
                />
                <button className="morphsearch-submit" type="submit">
                  Search
                </button>
              </form>
              <div className="morphsearch-content">
                <div className="dummy-column">
                  <h2>People</h2>
                  <Link className="dummy-media-object" to="#!">
                    <img
                      className="round"
                      src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&amp;d=identicon&amp;r=G"
                      alt="Sara Soueidan"
                    />
                    <h3>Sara Soueidan</h3>
                  </Link>
                </div>
                <div className="dummy-column">
                  <h2>Popular</h2>
                  <Link className="dummy-media-object" to="#!">
                    <img
                      src="assets/images/avatar-1.png"
                      alt="PagePreloadingEffect"
                    />
                    <h3>Page Preloading Effect</h3>
                  </Link>
                </div>
                <div className="dummy-column">
                  <h2>Recent</h2>
                  <Link className="dummy-media-object" to="#!">
                    <img
                      src="assets/images/avatar-1.png"
                      alt="TooltipStylesInspiration"
                    />
                    <h3>Tooltip Styles Inspiration</h3>
                  </Link>
                </div>
              </div>
              {/* <!-- /morphsearch-content --> */}
              <span className="morphsearch-close">
                <i className="icofont icofont-search-alt-1"></i>
              </span>
            </div>
            {/* <!-- search end --> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
