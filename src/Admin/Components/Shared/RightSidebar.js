import { Link } from "react-router-dom";
export default function RightSidebar() {
  return (
    <div id="sidebar" className="users p-chat-user showChat">
      <div className="had-container">
        <div className="card card_main p-fixed users-main">
          <div className="user-box">
            <div className="card-block">
              <div className="right-icon-control">
                {/* <input type="text" className="form-control  search-text" placeholder="Search Friend" id="search-friends"> */}
                <div className="form-icon">
                  <i className="icofont icofont-search"></i>
                </div>
              </div>
            </div>
            <div className="main-friend-list">
              <div
                className="media userlist-box"
                data-id="1"
                data-status="online"
                data-username="Josephin Doe"
                data-toggle="tooltip"
                data-placement="left"
                title="Josephin Doe"
              >
                <Link className="media-left" to="#!">
                  {/* <img className="media-object img-circle" src="assets/images/avatar-1.png" alt="Generic placeholder image"> */}
                  <div className="live-status bg-success"></div>
                </Link>
                <div className="media-body">
                  <div className="f-13 chat-header">Josephin Doe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
