import { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useVendorPaymentApi from "./useVendorPaymentApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/VendorPayment.module.css";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useUtility from "../../../hooks/useUtility";

export default function CreateVendorPayment() {
  const { receivedOrderId } = useParams();
  console.log(receivedOrderId);
  const select2Ref = useRef();
  const { generateDateForApi } = useUtility();
  const { onError, onSuccess } = useToster();
  const {
    createVendorPaymentRequest,
    itemVendorPaymentNumRequest,
    payableReceivedOrderByReceivedId,
  } = useVendorPaymentApi();
  // initioal value
  const initialFormData = {
    item_receive_id: "",
    vendor_payment_no: "",
    payable_amount: 0,
    current_payable_amount: 0,
    last_paid_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    discount: 0,
    vendor_name: 0,
    payment_date: new Date(),
    comments: "",
    status: 1,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [itemPhotos, setItemPhotos] = useState(null);

  // Get Payable received order Data -----------------
  const { refetch: payableReceivedOrderRefetch } = useQuery(
    ["payableReceivedOrderByReceivedId", receivedOrderId],
    payableReceivedOrderByReceivedId,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          const payableReceiveOrder = response.data.result;

          setAllData({
            ...allData,
            ["payable_amount"]: payableReceiveOrder.payable_amount,
            ["current_payable_amount"]:
              payableReceiveOrder.payable_amount -
              payableReceiveOrder.paid_amount,
            ["last_paid_amount"]: payableReceiveOrder.paid_amount,
            ["due_amount"]: payableReceiveOrder.due_amount,
            ["vendor_name"]: payableReceiveOrder.vendor_name,
            ["item_receive_id"]: payableReceiveOrder.id,
            ["vendor_id"]: payableReceiveOrder.vendor_id,
          });
        }
      },
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );

  // Refetch Order Data -----
  async function handleRefetchOrderData() {
    payableReceivedOrderRefetch();
  }
  // Get Vendor pament no. ---------------
  const { refetch: vendoerPayemntNumRefetch } = useQuery(
    "itemVendorPaymentNumRequest",
    itemVendorPaymentNumRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          await setAllData({
            ...allData,
            vendor_payment_no: response.data,
          });
        }
      },
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );

  // useEffect(() => {
  //   handleChange("", maxSequenceData?.data?.result?.sequence);
  // }, [maxSequenceData]);

  const handleChange = (e, maxSequenceData) => {
    if (e) {
      // on user change -----
      setAllData({ ...allData, [e.target.name]: e.target.value });
    }
  };

  function handelImage(e) {
    setItemPhotos(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  const onInputChange = async (selectedOptions, select2Ref) => {
    setAllData({
      ...allData,
      [select2Ref.name]: selectedOptions,
    });
  };

  function makeItemOrderAbleList(itemObj) {
    const singleItemObject = {};
    singleItemObject.itemId = itemObj.itemId;
    singleItemObject.name = itemObj.searchQuery;
    singleItemObject.itemQty = itemObj.itemQty;
    singleItemObject.itemPrice = itemObj.itemPrice;
    singleItemObject.itemTotalPrice = itemObj.itemPrice * itemObj.itemQty;
    return singleItemObject;
  }

  // Deduct discount from subTotal and set discount to allData State-------
  const handlePaidAmount = async (e) => {
    //return console.log(e);
    setAllData({
      ...allData,
      ["due_amount"]: allData.current_payable_amount - e.target.value,
      ["paid_amount"]: e.target.value,
    });
  };
  const handleDateChange = async (e) => {
    setAllData({ ...allData, ["payment_date"]: e });
    console.log(e);
  };

  // Create Api MutateAsync --------------
  const { mutateAsync, isLoading: submitLoader } = useMutation(
    "createVendorPaymentRequest",
    createVendorPaymentRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("vendor_id", allData.vendor_id);
    formData.append("item_receive_id", allData.item_receive_id);
    formData.append("receive_no", allData.receive_no);
    formData.append("paid_amount", allData.paid_amount);
    formData.append("comments", allData.comments);
    formData.append("payment_date", generateDateForApi(allData.payment_date));

    formData.append("note", allData.comments);

    await mutateAsync(formData);
    if (!submitLoader) {
      await setAllData(initialFormData);
      await vendoerPayemntNumRefetch();
    }
    //return navigate("/admin/items-orders/list", { replace: true });
  };

  return (
    <>
      <PageHeader pageTitle={" Received Order"} actionPage={"Receive Order"} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5> Create New Items Order Here </h5>

              <span></span>
              <div className="card-header-right">
                <i
                  onClick={handleRefetchOrderData}
                  className="icofont icofont-refresh"
                ></i>
                <Link to="/admin/item-received/list" title="Received list">
                  Order Received List <i className="icofont icofont-list"></i>
                </Link>
              </div>
            </div>
            <div className="card-block">
              <form onSubmit={handleSubmit}>
                {/* ------------------Top side-----------------------  */}
                <div className="form-group row">
                  <div className="col-sm-3">
                    <div className="">
                      <label className=" col-form-label">Payment ID</label>
                      <input
                        name="vendor_payment_no"
                        value={allData.vendor_payment_no}
                        onChange={handleChange}
                        type="text"
                        readOnly
                        className="form-control"
                        placeholder="Payment ID"
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label className=" col-form-label">Vendor</label>
                    <input
                      name="vendor_name"
                      value={allData.vendor_name}
                      onChange={handleChange}
                      type="text"
                      readOnly
                      className="form-control"
                      placeholder="Vendor name"
                    />
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">Payment Date</label>
                    <DatePicker
                      showIcon
                      className="form-control"
                      isClearable
                      dateFormat="yyyy/MM/dd"
                      placeholderText="I have been cleared!"
                      selected={allData.payment_date}
                      name="payment_date"
                      onChange={handleDateChange}
                      required
                    />
                    {/* <input
                          name="tentative_date"
                          value={allData.tentative_date}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Tentative Oreder Receive Date"
                        /> */}
                  </div>
                  {/* <div className="col-sm-3">
                    <div className="">
                      <label className=" col-form-label">Invoice No.</label>
                      <input
                        name="invoice_no"
                        value={allData.invoice_no}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        placeholder="Invoice No. "
                      />
                    </div>
                  </div> */}
                </div>

                {/* end row */}

                <hr />
                <div className="row justify-content-start">
                  <div className="col-md-4">
                    <textarea
                      name="comments"
                      value={allData.comments}
                      onChange={handleChange}
                      rows="8"
                      cols="5"
                      className="form-control"
                      placeholder="Note Here"
                    ></textarea>
                  </div>
                  <div className="col-md-4">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <td className="text-right">Total Payable Amount :</td>
                          <td className="text-bold">
                            {allData.payable_amount}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right">Last Total Paid :</td>
                          <td className="text-bold">
                            {allData.last_paid_amount}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-right">
                            <b className="font-weight-bold">
                              Current Payable Amount
                            </b>{" "}
                            :
                          </td>
                          <td className="text-bold">
                            {allData.current_payable_amount}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right">
                            <b>Paid Amount</b> :
                          </td>
                          <td>
                            <input
                              type="number"
                              name=""
                              max={allData.current_payable_amount}
                              min={1}
                              value={allData.paid_amount}
                              onChange={handlePaidAmount}
                              required
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right">
                            <b>Du Amount</b> :
                          </td>
                          <td>{allData.due_amount}</td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>

                <div className="row justify-content-left">
                  <label className="col-md-2 col-form-label">
                    {submitLoader ? (
                      <button
                        type="button"
                        className="btn btn-default btn-md btn-block waves-effect text-center m-b-20"
                      >
                        Submit ...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20"
                      >
                        Submit
                      </button>
                    )}
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
