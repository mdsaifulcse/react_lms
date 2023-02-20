import { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemOrderApi from "./useItemOrderApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/ItemOrder.module.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemList from "./ItemList";
import useUtility from "../../../hooks/useUtility";

export default function CreateItemOrder() {
  const select2Ref = useRef();
  const { generateDateForApi } = useUtility();
  const { onError, onSuccess } = useToster();
  const {
    createItemOrderRequest,
    activeVendorsRequest,
    itemOrderNoRequest,
    activeItemSearch,
  } = useItemOrderApi();
  // initioal value
  const initialFormData = {
    vendor_id: "",
    vendorSetOption: "",
    order_no: "",
    amount: 0,
    discount: 0,
    total: 0,
    tentative_date: new Date(),
    item_id: "",
    item_qty: "",
    item_price: "",
    note: "",
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
  const [addError, setAddError] = useState("");

  const [searchQueryResult, setSearchQueryResult] = useState([]);
  const [displayState, setDisplayState] = useState("none");

  const [itemOrderAbleList, setItemOrderAbleList] = useState([]);

  // Get Item Order no. ---------------
  const { refetch: itemOrderNoRefetch } = useQuery(
    "itemOrderNoRequest",
    itemOrderNoRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          console.log(response.data);
          await setAllData({
            ...allData,
            order_no: response.data,
          });
        }
      },
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );
  //Get Active Vendor Data-----------------------------
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
    //if (maxSequenceData) {
    //   // when api response -----
    //   setAllData({
    //     ...allData,
    //     sequence: maxSequenceData,
    //   });

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

  const itemSearchHandeler = async (e) => {
    setAddItemQtyPrice({
      ...addItemQtyPrice,
      [e.target.name]: e.target.value,
    });
  };
  // User when select item name --------
  const setItemHandeler = async (e) => {
    e.preventDefault();
    setAddItemQtyPrice({
      ...addItemQtyPrice,
      [e.target.name]: e.target.innerHTML,
      ["itemId"]: e.target.id,
    });
    setDisplayState("none");
  };

  // Get Search Items -----
  const { isLoading: searchLoading, refetch: activeItemSearchRefetch } =
    useQuery(
      ["activeItemSearch", addItemQtyPrice.searchQuery],
      activeItemSearch,
      {
        onSuccess: async (response) => {
          if (response.status === 200) {
            setSearchQueryResult(response.data);
            if (response.data.length > 0) {
              setDisplayState("block");
            } else {
              setDisplayState("none");
            }
          }
        },
        onError: onError,
        refetchOnWindowFocus: false,
      }
    );

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
    if (addItemQtyPrice.searchQuery.length === 0) {
      return setAddError("Item is required");
    } else if (addItemQtyPrice.itemQty === 0) {
      return setAddError("Item quantity is required");
    } else if (addItemQtyPrice.itemPrice === 0) {
      return setAddError("Item price is required");
    } else {
      // checke Item alrady exist or not -------
      if (itemOrderAbleList.length > 0) {
        if (
          itemOrderAbleList.find(
            (item) => item.itemId === addItemQtyPrice.itemId
          )
        ) {
          return setAddError(addItemQtyPrice.searchQuery + " Already Exist");
        }
      }

      // Add to the list ------------------
      const itemArray = await makeItemOrderAbleList(addItemQtyPrice);
      // Calculate --- SubTotal and Total When Add Item to order list
      setAllData({
        ...allData,
        ["amount"]: allData.amount + itemArray.itemTotalPrice,
        ["total"]: allData.amount + itemArray.itemTotalPrice,
      });

      await setItemOrderAbleList([...itemOrderAbleList, itemArray]);
      await setAddError("");
      // Reset search, Quantity and price field -------------------
      setAddItemQtyPrice(initialItemQtyPrice);
    }
  };

  // Delete item from orderable list

  const deleteItemFromList = async (index) => {
    setItemOrderAbleList(
      itemOrderAbleList.filter((item, i) => {
        if (i === index) {
          setAllData({
            ...allData,
            ["amount"]: allData.amount - item.itemTotalPrice,
            ["total"]: allData.amount - item.itemTotalPrice,
            ["discount"]: 0,
          });
        }
        return i !== index;
      })
    );

    // const filteredArray = await itemOrderAbleList.filter(
    //   (item, i) => {
    //     if (i === index) {
    //       setAllData({
    //         ...allData,
    //         ["amount"]: allData.amount - item.itemTotalPrice,
    //         ["total"]: allData.amount - item.itemTotalPrice,
    //         ["discount"]: 0,
    //       });
    //     }
    //     return i !== index;
    //   }
    //   //(item, i) => i !== index
    // );

    //await setItemOrderAbleList(filteredArray);

    // const initialValue = 0;
    // const accumulator = 0;
    // const amount = filteredArray.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue.itemTotalPrice,
    //   initialValue
    // );

    // await setAllData({
    //   ...allData,
    //   ["amount"]: amount,
    //   ["total"]: amount,
    //   ["discount"]: 0,
    // });

    //const newArrayObj = itemOrderAbleList.splice(index, 1);
    //itemOrderAbleList.filter((item, i) => i !== index)
  };

  // Deduct discount from subTotal and set discount to allData State-------
  const discountHandle = async (e) => {
    //return console.log(e);
    setAllData({
      ...allData,
      ["total"]: allData.amount - e.target.value,
      ["discount"]: e.target.value,
    });
  };

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "createItemOrderRequest",
    createItemOrderRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(itemOrderAbleList);

    //add itmeId,Qty, Price to FormData
    await itemOrderAbleList.map((item, i) => {
      formData.append(`item_id[]`, item.itemId);
      formData.append(`item_qty[]`, item.itemQty);
      formData.append(`item_price[]`, item.itemPrice);
    });

    formData.append(
      "vendor_id",
      Object.keys(allData.vendorSetOption).length > 0
        ? allData.vendorSetOption.id
        : ""
    );
    formData.append("order_no", allData.order_no);
    formData.append("amount", allData.amount);
    formData.append("discount", allData.discount);
    formData.append(
      "tentative_date",
      generateDateForApi(allData.tentative_date)
    );

    formData.append("note", allData.note);
    formData.append("status", allData.status);

    await mutateAsync(formData);
    await setAllData(initialFormData);
    await setItemOrderAbleList([]);
    await itemOrderNoRefetch();
    //return navigate("/admin/items-orders/list", { replace: true });
  };

  return (
    <>
      <PageHeader pageTitle={"Create New Item"} actionPage={"Create Item"} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5> Create New Items Order Here </h5>

              <span></span>
              <div className="card-header-right">
                {/* <i className="icofont icofont-refresh"></i> */}
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
                      <label className=" col-form-label">Order Id</label>
                      <input
                        name="order_no"
                        value={allData.order_no}
                        onChange={handleChange}
                        type="text"
                        readOnly
                        className="form-control"
                        placeholder="Tentative Oreder Receive Date"
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
                        options={vendors}
                        required
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      Tentative Receive Date
                    </label>
                    <DatePicker
                      showIcon
                      className="form-control"
                      isClearable
                      dateFormat="yyyy/MM/dd"
                      placeholderText="I have been cleared!"
                      selected={allData.tentative_date}
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
                      <label className=" col-form-label">Status</label>
                      <select
                        name="status"
                        onChange={handleChange}
                        defaultValue={allData.status}
                        className="form-control"
                      >
                        <option value="">Select One</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Item Search */}
                <div
                  className="form-group row"
                  style={{ backgroundColor: "#dfdfdf", padding: "10px" }}
                >
                  <div className="col-md-5" style={{ position: "relative" }}>
                    <label className=" col-form-label">Search Item</label>
                    <input
                      type="text"
                      className="form-control"
                      name="searchQuery"
                      value={addItemQtyPrice.searchQuery}
                      onChange={itemSearchHandeler}
                      placeholder="Type here to item search"
                    />
                    {searchLoading ? (
                      "loading..."
                    ) : (
                      <ul
                        style={{
                          display: `${displayState}`,
                          height: " 180px",
                          overflowY: "scroll",
                          backgroundColor: "#e9e9e9",
                          position: "absolute",
                          width: "100%",
                          zIndex: 999,
                        }}
                      >
                        {searchQueryResult.map((result, i) => (
                          <li key={i}>
                            {" "}
                            <a
                              id={result.id}
                              href="noaction"
                              name="searchQuery"
                              dataitemid="itemId"
                              style={{ cursor: "pointer" }}
                              onClick={setItemHandeler}
                            >
                              {result.title}
                            </a>{" "}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-md-2">
                    <label className=" col-form-label">Quantity</label>
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      max="999999"
                      name="itemQty"
                      value={addItemQtyPrice.itemQty}
                      onChange={itemSearchHandeler}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className=" col-form-label">Price</label>
                    <input
                      type="number"
                      min="0"
                      max="999999"
                      className="form-control"
                      name="itemPrice"
                      value={addItemQtyPrice.itemPrice}
                      onChange={itemSearchHandeler}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className=" col-form-label"> </label>
                    <br />
                    <br />
                    <button
                      className="btn btn-warning btn-sm"
                      type="button"
                      onClick={addItemToOrderList}
                      title="Click here to add item to order list"
                    >
                      Add <i className="icofont icofont-plus"></i>
                    </button>
                  </div>
                  <div className="col-md-12 text-danger text-center">
                    <br />
                    {addError ? addError : ""}
                  </div>
                </div>
                {/* end row */}

                {/* Item Details */}
                <div className="form-group row">
                  <div className="col-md-12">
                    <ItemList
                      itemOrderAbleList={itemOrderAbleList}
                      deleteItemFromList={deleteItemFromList}
                    />
                  </div>
                </div>
                <hr />
                <div className="row justify-content-end">
                  <div className="col-md-4">
                    <textarea
                      name="note"
                      value={allData.note}
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
                          <td className="text-right">Sub Total :</td>
                          <td className="text-bold">{allData.amount}</td>
                        </tr>
                        <tr>
                          <td className="text-right">Discount :</td>
                          <td>
                            <input
                              type="number"
                              max={allData.amount}
                              min={0}
                              value={allData.discount}
                              onChange={discountHandle}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right">Total :</td>
                          <td>{allData.total}</td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>

                <div className="row justify-content-left">
                  <label className="col-md-2 col-form-label">
                    <button
                      type="submit"
                      className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20"
                    >
                      Submit
                    </button>
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
