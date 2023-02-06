import React from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

export default function ShowVendorModal({
  data,
  show,
  onHide,
  headTitle,
  cardHeader,
}) {
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
                        <div className="col-lg-3 col-xl-3">
                          <div className="card">
                            <div className="card-header contact-user">
                              {data.photo ? (
                                <>
                                  <img
                                    className="img-circle"
                                    src={data.photo}
                                    alt={data.name}
                                  />
                                </>
                              ) : (
                                "No Photo"
                              )}

                              <h4>{data.name}</h4>
                            </div>
                          </div>
                        </div>
                        {/* <!-- end of table col-lg-6 --> */}
                        <div className="col-lg-9 col-xl-9">
                          <table className="table">
                            <tbody>
                              <tr>
                                <th scope="row">Name</th>
                                <td>{data.name}</td>
                              </tr>
                              <tr>
                                <th scope="row">Mobile</th>
                                <td>{data.mobile}</td>
                              </tr>
                              <tr>
                                <th scope="row">Email</th>
                                <td>{data.email}</td>
                              </tr>
                              <tr>
                                <th scope="row">Contact Person</th>
                                <td>{data.contact_person}</td>
                              </tr>
                              <tr>
                                <th scope="row">Contact Person Mobile</th>
                                <td>{data.contact_person_mobile}</td>
                              </tr>
                              <tr>
                                <th scope="row">Primary Supply Products</th>
                                <td>{data.office_address}</td>
                              </tr>
                              <tr>
                                <th scope="row">Office Address</th>
                                <td>{data.office_address}</td>
                              </tr>
                              <tr>
                                <th scope="row">Warehouse Address</th>
                                <td>{data.warehouse_address}</td>
                              </tr>
                              <tr>
                                <th scope="row">Primary Supply Products</th>
                                <td>{data.primary_supply_products}</td>
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
                              <tr>
                                <th scope="row">Show at Home?</th>
                                <td>{data.show_home === 1 ? "Yes" : "No"}</td>
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
