import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

export default function ShowItemRentalModal({
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
        fullscreen={false}
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
            <div className="card-block">
              <div className="view-info">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="general-info">
                      <div className="row">
                        <div className="col-lg-12 col-xl-12">
                          <table className="table table-bordered table-striped">
                            <tbody>
                              <tr>
                                <th>Rental No.</th>
                                <th>User</th>
                                <th>Qty</th>
                                <th>Rental Date</th>
                                <th>Status</th>
                              </tr>
                              <tr>
                                <td>{data.rental_no}</td>
                                <td>{data.user ? data.user.name : ""}</td>
                                <td>{data.qty}</td>
                                <td>{data.rental_date}</td>
                                <td>
                                  {data.status === 0 ? (
                                    <>
                                      <span className="text-warning">
                                        Rental
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {data.status === 1 ? (
                                    <>
                                      <span className="text-success">
                                        Return
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {data.status === 2 ? (
                                    <>
                                      <span className="text-danger">
                                        Overdue
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th className="text-center">SL</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Qty</th>
                                <th className="text-center">Return Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.itemRentalDetails ? (
                                data.itemRentalDetails.map((item, i) => (
                                  <tr key={i} id={i} className="text-center">
                                    <td>{i + 1}</td>
                                    <td>{item.item_title}</td>
                                    <td>{item.item_qty}</td>
                                    <td>{item.return_date}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    No data
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        {/* <!-- end of table col-lg-6 --> */}
                      </div>
                      {/* <!-- end of row --> */}
                      <hr />
                      <div className="row justify-content-start">
                        <div className="col-md-6">
                          <b>Notes:</b>
                          <p>{data.note}</p>
                        </div>
                      </div>
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
