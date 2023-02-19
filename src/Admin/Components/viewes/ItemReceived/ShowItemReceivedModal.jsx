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
                                <th>Received No.</th>
                                <th>Vendor</th>
                                <th>Receive Date</th>
                                <th>Invoice</th>
                              </tr>
                              <tr>
                                <td>{data.receive_no}</td>
                                <td>{data.vendor_name}</td>
                                <td>{data.received_date}</td>
                                <td>{data.invoice_no}</td>
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
                              {data.itemReceiveDetails ? (
                                data.itemReceiveDetails.map((item, i) => (
                                  <tr key={i} id={i} className="text-center">
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
                                  <b>Payable Amount</b> :
                                </td>
                                <td className="text-bold">
                                  <b>{data.payable_amount}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-right">
                                  <b>Paid Amount</b> :
                                </td>
                                <td>
                                  <b>{data.paid_amount}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-right">
                                  <b>Due Amount</b> :
                                </td>
                                <td>
                                  <b>{data.due_amount}</b>
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
