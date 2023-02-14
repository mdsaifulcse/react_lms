import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

export default function ShowItemModal({
  data,
  show,
  onHide,
  modalTitle,
  cardHeader,
}) {
  console.log(data);
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
            {modalTitle}
          </Modal.Title>
          <span onClick={onHide} role="button" className="text-danger">
            X
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            {/* <div className="card-header">
              <h5 className="card-header-text">
                {cardHeader} ({data.title})
              </h5>
              <Link to={`/admin/items/edit/${data.id}`} title="Edit Item">
                <button
                  id="edit-btn"
                  type="button"
                  className="btn btn-sm btn-primary waves-effect waves-light f-right"
                >
                  <i className="icofont icofont-edit"></i>
                </button>
              </Link>
            </div> */}
            <div className="card-block">
              <div className="view-info">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="general-info">
                      <div className="row">
                        {/* <div className="col-lg-3 col-xl-3">
                          <div className="card">
                            <div className="card-header contact-user">
                              {data.itemThumbnails ? (
                                <img
                                  className="img img-circle"
                                  src={data.itemThumbnails[0].medium}
                                  alt="contact-user"
                                  style={{ width: "100%" }}
                                />
                              ) : (
                                <img
                                  className="img-circle"
                                  src=""
                                  alt="contact-user"
                                />
                              )}

                              <h4>{data.title}</h4>
                            </div>
                          </div>
                        </div> */}
                        {/* <!-- end of table col-lg-6 --> */}
                        <div className="col-lg-12 col-xl-12">
                          <table className="table">
                            <tbody>
                              <tr>
                                <th>Order No.</th>
                                <th>Vendor</th>
                                <th>Tentative Receive Date</th>
                                <th>Status</th>
                              </tr>
                              <tr>
                                <td>{data.order_no}</td>
                                <td>{data.vendor_name}</td>
                                <td>{data.tentative_date}</td>
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
