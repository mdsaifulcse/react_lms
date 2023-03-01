import { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemRentalApi from "./useItemRentalApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/ItemRental.module.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemList from "./ItemList";
import useUtility from "../../../hooks/useUtility";

export default function CreateItemRental() {
  const select2Ref = useRef();
  const { generateDateForApi } = useUtility();
  const { onError, onSuccess } = useToster();
  const {
    createItemRentalRequest,
    activeGenralsRequest,
    itemRentalNoRequest,
    activeItemSearch,
  } = useItemRentalApi();
  // initioal value
  const initialFormData = {
    user_id: "",
    userSetOption: "",
    rental_no: "",
    rental_date: "", //new Date(),
    item_id: "",
    item_qty: "",
    note: "",
    status: 1,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [generals, setGenerals] = useState([]);
  const [itemPhotos, setItemPhotos] = useState(null);
  // clicke Add Button
  const initialItemQtyPrice = {
    itemId: "",
    searchQuery: "",
    itemQty: 0,
    itemReturnDate: "",
  };
  const [addItemQtyPrice, setAddItemQtyPrice] = useState(initialItemQtyPrice);
  const [addError, setAddError] = useState("");

  const [searchQueryResult, setSearchQueryResult] = useState([]);
  const [displayState, setDisplayState] = useState("none");

  const [itemOrderAbleList, setItemOrderAbleList] = useState([]);

  // Get Item Rental no. ---------------
  const { refetch: itemOrderNoRefetch } = useQuery(
    "itemRentalNoRequest",
    itemRentalNoRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          console.log(response.data);
          await setAllData({
            ...allData,
            rental_no: response.data,
          });
        }
      },
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );
  //Get Active General Data-----------------------------
  useQuery("activeGenralsRequest", activeGenralsRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setGenerals(response.data.result);
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

  const onInputChange = async (selectedOptions, select2Ref) => {
    setAllData({
      ...allData,
      [select2Ref.name]: selectedOptions,
    });
  };

  const handleDateChange = async (e) => {
    setAllData({ ...allData, ["rental_date"]: e });
  };
  const handleItemReturnDateChange = async (e) => {
    setAddItemQtyPrice({ ...addItemQtyPrice, ["itemReturnDate"]: e });
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
    singleItemObject.itemReturnDate = itemObj.itemReturnDate;
    return singleItemObject;
  }

  const addItemToOrderList = async () => {
    if (addItemQtyPrice.searchQuery.length === 0) {
      return setAddError("Item is required");
    } else if (addItemQtyPrice.itemQty === 0) {
      return setAddError("Item quantity is required");
    } else if (!addItemQtyPrice.itemReturnDate) {
      return setAddError("Item return date is required");
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
        return i !== index;
      })
    );
  };

  // Create Api MutateAsync --------------
  const { mutateAsync, isLoading: submitLoader } = useMutation(
    "createItemRentalRequest",
    createItemRentalRequest,
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
      formData.append(
        `item_return_date[]`,
        generateDateForApi(item.itemReturnDate)
      );
    });

    formData.append(
      "user_id",
      Object.keys(allData.userSetOption).length > 0
        ? allData.userSetOption.id
        : ""
    );
    formData.append("rental_no", allData.rental_no);
    formData.append("rental_date", generateDateForApi(allData.rental_date));

    formData.append("note", allData.note);
    formData.append("status", allData.status);

    await mutateAsync(formData);
    if (!submitLoader) {
      await setAllData(initialFormData);
      await setItemOrderAbleList([]);
      await itemOrderNoRefetch();
    }

    //return navigate("/admin/item-rental/list", { replace: true });
  };

  return (
    <>
      <PageHeader
        pageTitle={"Create New Item Rental"}
        actionPage={"Create Item"}
      />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5> Create New Items Rental Here </h5>

              <span></span>
              <div className="card-header-right">
                {/* <i className="icofont icofont-refresh"></i> */}
                <Link to="/admin/item-rental/list" title="Item list">
                  Items Rental List <i className="icofont icofont-list"></i>
                </Link>
              </div>
            </div>
            <div className="card-block">
              <form onSubmit={handleSubmit}>
                {/* ------------------Top side-----------------------  */}
                <div className="form-group row">
                  <div className="col-sm-2">
                    <div className="">
                      <label className=" col-form-label">Rental Id</label>
                      <input
                        name="rental_no"
                        value={allData.rental_no}
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
                      <label className=" col-form-label">User</label>
                      <Select
                        ref={select2Ref}
                        classNamePrefix="select User"
                        onChange={onInputChange}
                        getOptionValue={(option) => `${option["id"]}`}
                        getOptionLabel={(option) => `${option["name"]}`}
                        name="userSetOption"
                        value={allData.userSetOption}
                        options={generals}
                        required
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <label className="col-form-label">Rental Date</label>
                    <DatePicker
                      showIcon
                      className="form-control"
                      isClearable
                      dateFormat="yyyy/MM/dd"
                      placeholderText="I have been cleared!"
                      selected={allData.rental_date}
                      name="rental_date"
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                  <div className="col-sm-2">
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
                    <label className=" col-form-label">Return Date</label>

                    <DatePicker
                      showIcon
                      className="form-control"
                      isClearable
                      dateFormat="yyyy/MM/dd"
                      placeholderText="I have been cleared!"
                      selected={addItemQtyPrice.itemReturnDate}
                      name="itemReturnDate"
                      onChange={handleItemReturnDateChange}
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
                <div className="row justify-content-start">
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
