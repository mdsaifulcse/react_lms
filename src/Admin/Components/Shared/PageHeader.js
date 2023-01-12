import { Link } from "react-router-dom";
export default function PageHeader({ pageTitle, actionPage }) {
  return (
    <div className="page-header">
      <div className="page-header-title">
        <h4>{pageTitle}</h4>
      </div>
      <div className="page-header-breadcrumb">
        <ul className="breadcrumb-title">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">
              <i className="icofont icofont-home"></i> Admin
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">
              {actionPage}
              {/* <i className="icofont icofont-home"></i>  */}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
