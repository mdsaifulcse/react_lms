import { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemOrderApi from "./useItemReceivedApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/ItemReceived.module.css";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemList from "./ItemList";
import useUtility from "../../../hooks/useUtility";

export default function CreateItemReceived() {
  const { orderId } = useParams();
  const select2Ref = useRef();
  const { generateDateForApi } = useUtility();
  const { onError, onSuccess } = useToster();
  const {
    createItemReceivedRequest,
    activeVendorsRequest,
    itemReceivedNoRequest,
    unreceivedOrderByOrderIdRequest,
  } = useItemOrderApi();
  // initioal value
  const initialFormData = {
    item_order_id: "",
    vendor_id: "",
    vendorSetOption: "",
    receive_no: "",
    invoice_no: "",
    payable_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    discount: 0,
    received_date: new Date(),
    item_id: "",
    item_qty: "",
    item_price: "",
    comments: "",
    status: 1,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [vendors, setVendors] = useState([]);
  const [itemPhotos, setItemPhotos] = useState(null);
  const [brochureFile, setItemBrochureFile] = useState(null);
  // clicke Add Button
  const initialItemQtyPrice = {
    itemId: "",
    searchQuery: "",
    itemQty: 0,
    itemPrice: 0,
  };
  const [addItemQtyPrice, setAddItemQtyPrice] = useState(initialItemQtyPrice);

  const [itemOrderAbleList, setItemOrderAbleList] = useState([]);

  // Get Item Order Data -----------------
  const { refetch: itemOrederDataRefetch } = useQuery(
    ["unreceivedOrderByOrderIdRequest", orderId],
    unreceivedOrderByOrderIdRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          const itemOrder = response.data.result;
          console.log(itemOrder);
          let payable_amount = 0;
          let due_amount = 0;
          await setItemOrderAbleList(
            // Add new property as orgQty to maintail max input for itemQty
            // Claculate PayableAmount
            response.data.result.itemOrderDetails.filter((item) => {
              payable_amount += item.itemTotalPrice;
              due_amount += item.itemTotalPrice;

              return (item.orgQty = item.itemQty);
            })
          );
          setAllData({
            ...allData,
            ["payable_amount"]: payable_amount,
            ["due_amount"]: due_amount,
            ["vendor_name"]: itemOrder.vendor_name,
            ["item_order_id"]: itemOrder.id,
            ["vendor_id"]: itemOrder.vendor_id,
            ["vendorSetOption"]: {
              id: itemOrder.id,
              name: itemOrder.vendor_name,
            },
          });
        }
      },
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );

  // Refetch Order Data -----
  async function handleRefetchOrderData() {
    itemOrederDataRefetch();
  }
  // Get Item Receiv no. ---------------
  const { refetch: itemOrderNoRefetch } = useQuery(
    "itemReceivedNoRequest",
    itemReceivedNoRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          await setAllData({
            ...allData,
            receive_no: response.data,
          });
        }
      },
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );
  //Get Active Vendor Data--------------------------------
  useQuery("activeVendorsRequest", activeVendorsRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setVendors(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowChange: false,
  });

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

  function handelFile(e) {
    setItemBrochureFile(e.target.files[0]);
  }

  const onInputChange = async (selectedOptions, select2Ref) => {
    setAllData({
      ...allData,
      [select2Ref.name]: selectedOptions,
    });
  };

  const handleDateChange = async (e) => {
    setAllData({ ...allData, ["tentative_date"]: e });
    console.log(e);
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

  const addItemToOrderList = async () => {
    // Add to the list ------------------
    const itemArray = await makeItemOrderAbleList(addItemQtyPrice);
    // Calculate --- SubTotal and Total When Add Item to order list
    setAllData({
      ...allData,
      ["amount"]: allData.amount + itemArray.itemTotalPrice,
      ["total"]: allData.amount + itemArray.itemTotalPrice,
    });

    await setItemOrderAbleList([...itemOrderAbleList, itemArray]);

    // Reset search, Quantity and price field -------------------
    setAddItemQtyPrice(initialItemQtyPrice);
  };

  // Delete item from orderable list
  const deleteItemFromList = async (index, itemName) => {
    // Delete Confiramtion -----------
    Swal.fire({
      title: "Warning!",
      text: `Do you want to delete ${itemName} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Finaly Delete
        setItemOrderAbleList(
          itemOrderAbleList.filter((item, i) => {
            if (i === index) {
              setAllData({
                ...allData,
                ["payable_amount"]:
                  allData.payable_amount - item.itemTotalPrice,
                ["due_amount"]: allData.payable_amount - item.itemTotalPrice,
                ["paid_amount"]: 0,
              });
            }
            return i !== index;
          })
        );
      } else {
        console.log("delete error");
      }
    });
  };

  // Delete item from orderable list
  const handleItemReceiveQty = async (e) => {
    let payable_amount = 0;
    let due_amount = 0;

    await setItemOrderAbleList(
      itemOrderAbleList.filter((item, i) => {
        if (i === parseInt(e.target.id)) {
          let changeQty = e.target.value;
          let itemTotalPrice = changeQty * item.itemPrice;
          // Update single Item Object ------
          item.itemQty = changeQty;
          item.itemTotalPrice = itemTotalPrice;
        }

        // Update Amunt and total --------

        payable_amount += item.itemTotalPrice;
        due_amount += item.itemTotalPrice;

        setAllData({
          ...allData,
          ["payable_amount"]: payable_amount,
          ["paid_amount"]: 0,
          ["due_amount"]: due_amount,
        });
        return item;
      })
    );
  };

  // Deduct discount from subTotal and set discount to allData State-------
  const handlePaidAmount = async (e) => {
    //return console.log(e);
    setAllData({
      ...allData,
      ["due_amount"]: allData.payable_amount - e.target.value,
      ["paid_amount"]: e.target.value,
    });
  };

  // Create Api MutateAsync --------------
  const { mutateAsync, isLoading: submitLoader } = useMutation(
    "createItemReceivedRequest",
    createItemReceivedRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    //add itmeId,Qty, Price to FormData
    await itemOrderAbleList.map((item, i) => {
      formData.append(`item_id[]`, item.itemId);
      formData.append(`item_qty[]`, item.itemQty);
    });

    formData.append("vendor_id", allData.vendor_id);
    formData.append("item_order_id", allData.item_order_id);
    formData.append("receive_no", allData.receive_no);
    formData.append("invoice_no", allData.invoice_no);
    formData.append("paid_amount", allData.paid_amount);
    formData.append("comments", allData.comments);
    formData.append("received_date", generateDateForApi(allData.received_date));

    formData.append("note", allData.note);
    formData.append("status", allData.status);

    await mutateAsync(formData);
    if (!submitLoader) {
      await setAllData(initialFormData);
      await setItemOrderAbleList([]);
      await itemOrderNoRefetch();
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
                <Link to="/admin/items-orders/list" title="Item list">
                  Items Order List <i className="icofont icofont-list"></i>
                </Link>
              </div>
            </div>
            <div className="card-block">
              <form onSubmit={handleSubmit}>
                {/* ------------------Top side-----------------------  */}
                <div className="form-group row">
                  <div className="col-sm-3">
                    <div className="">
                      <label className=" col-form-label">Receive ID</label>
                      <input
                        name="receive_no"
                        value={allData.receive_no}
                        onChange={handleChange}
                        type="text"
                        readOnly
                        className="form-control"
                        placeholder="Receive ID"
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="">
                      <label className=" col-form-label">Vendor</label>
                      <Select
                        ref={select2Ref}
                        classNamePrefix="select Authors"
                        onChange={onInputChange}
                        getOptionValue={(option) => `${option["id"]}`}
                        getOptionLabel={(option) => `${option["name"]}`}
                        name="vendorSetOption"
                        value={allData.vendorSetOption}
                        // options={vendors}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">Receive Date</label>
                    <DatePicker
                      showIcon
                      className="form-control"
                      isClearable
                      dateFormat="yyyy/MM/dd"
                      placeholderText="I have been cleared!"
                      selected={allData.received_date}
                      name="tentative_date"
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
                  <div className="col-sm-3">
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
                  </div>
                </div>

                {/* end row */}

                {/* Item Details */}
                <div className="form-group row">
                  <div className="col-md-12">
                    <ItemList
                      itemOrderAbleList={itemOrderAbleList}
                      deleteItemFromList={deleteItemFromList}
                      handleItemReceiveQty={handleItemReceiveQty}
                    />
                  </div>
                </div>
                <hr />
                <div className="row justify-content-end">
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
                          <td className="text-right">Payable Amount :</td>
                          <td className="text-bold">
                            {allData.payable_amount}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right">Paid Amount :</td>
                          <td>
                            <input
                              type="number"
                              name=""
                              max={allData.payable_amount}
                              min={0}
                              value={allData.paid_amount}
                              onChange={handlePaidAmount}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right">Du Amount :</td>
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
