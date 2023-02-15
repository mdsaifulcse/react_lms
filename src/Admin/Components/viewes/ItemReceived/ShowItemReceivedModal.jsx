import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

export default function ShowItemReceivedModal({
  data,
  show,
  onHide,
  modalTitle,
  cardHeader,
}) {
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
                        <div className="col-lg-12 col-xl-12">
                          <table className="table table-bordered table-striped">
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
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th className="text-center">SL</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Qty</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Item Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.itemOrderDetails ? (
                                data.itemOrderDetails.map((item, i) => (
                                  <tr key={i} id={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.itemQty}</td>
                                    <td>{item.itemPrice}</td>
                                    <td>{item.itemTotalPrice}</td>
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
                      <div className="row justify-content-end">
                        <div className="col-md-4">
                          <b>Notes:</b>
                          <p>{data.note}</p>
                        </div>
                        <div className="col-md-4">
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <td className="text-right">
                                  <b>Sub Total</b> :
                                </td>
                                <td className="text-bold">
                                  <b>{data.amount}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-right">
                                  <b>Discount</b> :
                                </td>
                                <td>
                                  <b>{data.discount}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-right">
                                  <b>Total</b> :
                                </td>
                                <td>
                                  <b>{data.total}</b>
                                </td>
                              </tr>
                            </thead>
                          </table>
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
