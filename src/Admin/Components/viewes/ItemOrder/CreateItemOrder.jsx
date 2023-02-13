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

export default function CreateItemOrder() {
  const select2Ref = useRef();
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
    //let returnArrayObject = [];
    const singleItemObject = {};
    singleItemObject.itemId = itemObj.itemId;
    singleItemObject.name = itemObj.searchQuery;
    singleItemObject.itemQty = itemObj.itemQty;
    singleItemObject.itemPrice = itemObj.itemPrice;
    singleItemObject.itemTotalPrice = itemObj.itemPrice * itemObj.itemQty;

    setAllData({
      ...allData,
      ["amount"]: allData.amount + singleItemObject.itemTotalPrice,
      ["total"]: allData.amount + singleItemObject.itemTotalPrice,
    });

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
      // Add to the list ------------------
      const itemArray = await makeItemOrderAbleList(addItemQtyPrice);
      await setItemOrderAbleList([...itemOrderAbleList, itemArray]);
      await setAddError("");
      setAddItemQtyPrice(initialItemQtyPrice);
    }
  };

  // Delete item from orderable list
  const deleteItemFromList = async (index) => {
    //const newArrayObj = itemOrderAbleList.splice(index, 1);
    await setItemOrderAbleList(
      itemOrderAbleList.filter((item, i) => i !== index)
    );
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
    // return console.log(allData);
    const formData = new FormData();

    // add Author id to FormData
    // await allData.item_authors.map((itemAuthor, i) => {
    //   formData.append(`author_id[]`, itemAuthor.id);
    // });

    formData.append(
      "vendor_id",
      Object.keys(allData.vendorSetOption).length > 0
        ? allData.vendorSetOption.id
        : ""
    );
    formData.append("title", allData.title);
    formData.append("isbn", allData.isbn);
    formData.append("edition", allData.edition);
    formData.append("number_of_page", allData.number_of_page);

    formData.append("show_home", allData.show_home);
    formData.append("publish_status", allData.publish_status);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);

    await mutateAsync(formData);
    setAllData(initialFormData);
    setFilePreview(defaultImage);
    //return navigate("/admin/items/list", { replace: true });
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
                        defaultValue={allData.vendorSetOption}
                        options={vendors}
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
                    <label className=" col-form-label">Item Search</label>
                    <input
                      type="text"
                      className="form-control"
                      name="searchQuery"
                      value={addItemQtyPrice.searchQuery}
                      onChange={itemSearchHandeler}
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
                      min="1"
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
                      min="1"
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
                <div className="row justify-content-end">
                  <div className="col-md-5">
                    <table className="table table-border">
                      <thead>
                        <tr>
                          <td className="text-right">Sub Total :</td>
                          <td className="text-bold">{allData.amount}</td>
                        </tr>
                        <tr>
                          <td className="text-right">Discount :</td>
                          <td>
                            <input type="number" />{" "}
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
