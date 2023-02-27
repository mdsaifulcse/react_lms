import React from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import useUtility from "../../../hooks/useUtility";

export default function ShowVendorModal({
  data,
  show,
  onHide,
  headTitle,
  cardHeader,
}) {
  const { formatAMPM } = useUtility();
  return (
    <>
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {headTitle}
          </Modal.Title>
          <span onClick={onHide} role="button" className="text-danger">
            X
          </span>
        </Modal.Header>

        <Modal.Body>
          <div className="card">
            <div className="card-header">
              {/* <h5 className="card-header-text">{cardHeader} ({data.name})</h5> */}
              {/* <Link
                to={`/admin/categories/edit/${data.id}`}
                title="Edit Publisher"
              >
                <button
                  id="edit-btn"
                  type="button"
                  className="btn btn-sm btn-primary waves-effect waves-light f-right"
                >
                  <i className="icofont icofont-edit"></i>
                </button>
              </Link> */}
            </div>
            <div className="card-block">
              <div className="view-info">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="general-info">
                      <div className="row">
                        {/* <!-- end of table col-lg-6 --> */}
                        <div className="col-lg-9 col-xl-9">
                          <table className="table">
                            <tbody>
                              <tr>
                                <th scope="row">User Name</th>
                                <td>{data.user_name}</td>
                              </tr>
                              <tr>
                                <th scope="row">Plan Name</th>
                                <td>{data.membership_plan}</td>
                              </tr>
                              <tr>
                                <th scope="row">Valid Till</th>
                                <td>{data.valid_till}</td>
                              </tr>

                              <tr>
                                <th scope="row">Status</th>
                                <td>
                                  {data.status === 1 ? (
                                    <>
                                      <span className="text-primary">
                                        Active
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-danger">
                                      Inactive
                                    </span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* <!-- end of table col-lg-6 --> */}
                      </div>
                      {/* <!-- end of row --> */}
                    </div>
                    {/* <!-- end of general info --> */}
                  </div>
                  {/* <!-- end of col-lg-12 --> */}
                </div>
                {/* <!-- end of row --> */}
              </div>
              {/* <!-- end of view-info --> */}
            </div>
            {/* <!-- end of card-block --> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={onHide} className="btn btn-danger">
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
