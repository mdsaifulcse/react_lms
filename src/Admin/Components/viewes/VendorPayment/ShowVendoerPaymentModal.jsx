import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import useToster from "../../../hooks/useToster";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import useItemReceivedApi from "./useVendorPaymentApi";
import { Tune } from "@mui/icons-material";
import Loading from "../../ui-component/Loading";

export default function ShowVendoerPaymentModal({
  data,
  show,
  onHide,
  modalTitle,
  cardHeader,
}) {
  const [paymentData, setPaymentData] = useState();
  const { onError, onSuccess } = useToster();
  const { vendorPaymentByReceivedIdRequest } = useItemReceivedApi();
  // //Get payments by receivedId data---------
  const { isLoading, refetch: vendoerPaymentRefetch } = useQuery(
    ["vendorPaymentByReceivedIdRequest", data.itemReceiveId],
    vendorPaymentByReceivedIdRequest,
    {
      onSuccess: (response) => {
        setPaymentData(response.data.result);
        console.log(response.data.result);
      },
      onError: onError,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  let paymentStatusTest = "";
  let paymentStatusClass = "";
  if (paymentData) {
    if (paymentData.payment_status == 1) {
      paymentStatusTest = "Paid";
      paymentStatusClass = "success";
    } else if (paymentData.payment_status == 2) {
      paymentStatusTest = "Unpaid";
      paymentStatusClass = "danger";
    } else {
      paymentStatusTest = "Due";
      paymentStatusClass = "warning";
    }
  }

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      console.log("123456789");
      vendoerPaymentRefetch();
    }
  }, [data]);
  return (
    <>
      {!paymentData ? (
        <Loading />
      ) : (
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
                                  <th>Payment Status</th>
                                  <th>Received No.</th>
                                  <th>Vendor</th>
                                  <th>Receive Date</th>
                                </tr>
                                <tr>
                                  <td>
                                    <span
                                      className={`btn btn-${paymentStatusClass} btn-sm`}
                                    >
                                      {paymentStatusTest}
                                    </span>
                                  </td>
                                  <td>{paymentData.receive_no}</td>
                                  <td>{paymentData.vendor_name}</td>
                                  <td>{paymentData.received_date}</td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th className="text-center">SL</th>
                                  <th className="text-center">Payment No.</th>
                                  <th className="text-center">Amount</th>
                                  <th className="text-center">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paymentData ? (
                                  paymentData.itemReceivePayments.vendorPayments.map(
                                    (item, i) => (
                                      <tr
                                        key={i}
                                        id={i}
                                        className="text-center"
                                      >
                                        <td>{i + 1}</td>
                                        <td>{item.vendor_payment_no}</td>
                                        <td>{item.paid_amount}</td>
                                        <td>{item.payment_date}</td>
                                      </tr>
                                    )
                                  )
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
                            {/* <b>Notes:</b>
                            <p>{paymentData.note}</p> */}
                          </div>
                          <div className="col-md-4">
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <td className="text-right">
                                    <b>Payable Amount</b> :
                                  </td>
                                  <td className="text-bold">
                                    <b>{paymentData.payable_amount}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-right">
                                    <b>Paid Amount</b> :
                                  </td>
                                  <td>
                                    <b>{paymentData.paid_amount}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-right">
                                    <b
                                      className={`btn btn-${paymentStatusClass} btn-sm`}
                                    >
                                      Due Amount
                                    </b>{" "}
                                    :
                                  </td>
                                  <td>
                                    <b>{paymentData.due_amount}</b>
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
      )}
    </>
  );
}
