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

export default function CreateItemOrder() {
  const select2Ref = useRef();
  const { onError, onSuccess } = useToster();
  const { createItemOrderRequest, activeVendorsRequest } = useItemOrderApi();
  // initioal value
  const initialFormData = {
    vendor_id: "",
    vendorSetOption: "",
    order_no: "",
    amount: "",
    tentative_date: "",
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

  function makeSelectedOptions(options) {
    let returnArrayObject = [];
    options.map((option, i) => {
      let singleObject = { value: option.id, label: option.name };
      // returnObject.value = option.id;
      // returnObject.label = option.name;
      returnArrayObject[i] = singleObject;
    });

    return returnArrayObject;
  }

  //Get Authors Data-----------------------------
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
    // }

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
    if (itemPhotos) {
      // add Image File to FormData
      formData.append("image[]", itemPhotos);
    }
    if (brochureFile) {
      // add brochureFile to FormData
      formData.append("brochure", brochureFile);
    }
    // add Author id to FormData
    await allData.item_authors.map((itemAuthor, i) => {
      formData.append(`author_id[]`, itemAuthor.id);
    });

    formData.append("title", allData.title);
    formData.append("isbn", allData.isbn);
    formData.append("edition", allData.edition);
    formData.append("number_of_page", allData.number_of_page);
    formData.append("summary", allData.summary);
    formData.append("video_url", allData.video_url);

    // formData.append("publisher_id", allData.publisher_id);
    // formData.append("language_id", allData.language_id);

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
                <div className="row justify-content-center">
                  {/* ------------------left side-----------------------  */}
                  <div className={`col-md-12 ${classes.inputSec} }`}>
                    <div className="form-group row">
                      <div className="col-sm-3">
                        <div className="">
                          <label className=" col-form-label">Order Id</label>
                          <input
                            name="order_no"
                            value={allData.order_no}
                            onChange={handleChange}
                            type="text"
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
                        <DatePicker showIcon />
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

                    <div className="row justify-content-center">
                      <label className="col-md-2 col-form-label">
                        <button
                          type="submit"
                          className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20"
                        >
                          Submit
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
