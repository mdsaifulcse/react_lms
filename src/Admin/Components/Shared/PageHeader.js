import { Link } from "react-router-dom";
export default function PageHeader() {
  return (
    <div className="page-header">
      <div className="page-header-title">
        <h4>Dashboard</h4>
      </div>
      <div className="page-header-breadcrumb">
        <ul className="breadcrumb-title">
          <li className="breadcrumb-item">
            <Link to="index-2.html">
              <i className="icofont icofont-home"></i>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
