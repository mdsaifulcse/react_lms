import { useState, useEffect, useRef } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemApi from "./useItemApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/Item.module.css";
import { Link } from "react-router-dom";
import Select from "react-select";

export default function CreateItem() {
  const select2Ref = useRef();
  const { onError, onSuccess } = useToster();
  const {
    getItemMaxSequence,
    createItemRequest,
    activeCategoriesRequest,
    activeSubCategoriesByCategoryRequest,
    activeAuthorListRequest,
    activeCountryListRequest,
    activeLanguageListRequest,
    activePublisherListRequest,
  } = useItemApi();
  const initialFormData = {
    title: "",
    isbn: "",
    edition: "",
    photo: defaultImage,
    number_of_page: "",
    summary: "",
    video_url: "",
    brochure: "",
    item_authors: [],
    publisher_id: "",
    language_id: "",
    country_id: "",
    category_id: "",
    subcategory_id: "",
    third_category_id: "",
    show_home: 0,
    status: 1,
    publish_status: 0,
    sequence: 1,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [itemPhoto, setItemPhoto] = useState(null);
  const [authorsId, setAuthorsId] = useState([]);

  function makeSelectOptions(options) {
    let returnArrayObject = [];
    options.map((option, i) => {
      let singleObject = { value: option.id, label: option.name };
      // returnObject.value = option.id;
      // returnObject.label = option.name;
      returnArrayObject[i] = singleObject;
    });

    return returnArrayObject;
  }
  //  Get Authors Data-----------------------------
  useQuery("activeAuthorListRequest", activeAuthorListRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        let authorOptions = makeSelectOptions(response.data.result);
        //console.log(authorOptions);
        await setAuthors(response.data.result);
        //await setAuthors(authorOptions);
      }
    },
    onError: onError,
    refetchOnWindowChange: false,
  });
  //  Get Publishers Data-----------------------------
  useQuery("activePublisherListRequest", activePublisherListRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setPublishers(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowChange: false,
  });
  //  Get Country Data-----------------------------
  useQuery("activeCountryListRequest", activeCountryListRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setCountries(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowChange: false,
  });
  //  Get Languages Data-----------------------------
  useQuery("activeLanguageListRequest", activeLanguageListRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setLanguages(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowChange: false,
  });
  //  Get categories Data-----------------------------
  const { data: categoriesData } = useQuery(
    "activeCategoriesRequest",
    activeCategoriesRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          await setCategories(response.data.result);
        }
      },
      onError: onError,
      refetchOnWindowChange: false,
    }
  );
  //  Get Sub-categories Data by categoryId-----------------------------
  const { data: subCategoriesData } = useQuery(
    ["activeSubCategoriesByCategoryRequest", allData.category_id],
    activeSubCategoriesByCategoryRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          await setSubCategories(response.data.result);
        }
      },
      onError: onError,
      refetchOnWindowChange: false,
      enabled: true,
    }
  );

  const { data: maxSequenceData, refetch } = useQuery(
    "getItemMaxSequence",
    getItemMaxSequence,
    {
      //onSuccess: onSuccess,
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );

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
      console.log(e);
      // on user change -----
      setAllData({ ...allData, [e.target.name]: e.target.value });
    }
  };

  function handelImage(e) {
    setItemPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  const onInputChange = async (data, select2Ref) => {
    let selectedIds = [];
    data.map((item, i) => {
      selectedIds.push(item.id);
    });
    setAllData({
      ...allData,
      [select2Ref.name]: selectedIds,
    });
  };

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation("createItemRequest", createItemRequest, {
    onSuccess: onSuccess,
    onError: onError,
  });

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    return console.log(allData);
    const formData = new FormData();
    if (itemPhoto) {
      formData.append("photo", itemPhoto);
    }

    formData.append("title", allData.title);
    formData.append("email", allData.email);
    formData.append("mobile", allData.mobile);
    formData.append("contact", allData.contact);
    formData.append("address1", allData.address1);
    formData.append("address2", allData.address2);
    formData.append("bio", allData.bio);
    formData.append("show_home", allData.show_home);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);

    await mutateAsync(formData);
    setAllData(initialFormData);
    setFilePreview(defaultImage);
    await refetch();
    //return navigate("/admin/items/list", { replace: true });
  };

  return (
    <>
      <PageHeader pageTitle={"Create New Item"} actionPage={"Create Item"} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5> Create New Item Here </h5>

              <span></span>
              <div className="card-header-right">
                {/* <i className="icofont icofont-refresh"></i> */}
                <Link to="/admin/items/list" title="Item list">
                  Item List <i className="icofont icofont-list"></i>
                </Link>
              </div>
            </div>
            <div className="card-block">
              <form onSubmit={handleSubmit}>
                <div className="row justify-content-center">
                  {/* ------------------eft side-----------------------  */}
                  <div className={`col-md-9 ${classes.inputSec} }`}>
                    <div className=" row">
                      <div className="col-sm-12">
                        <label className=" col-form-label">Title</label>
                        <input
                          name="title"
                          value={allData.title}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type Item Title"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="col-form-label">ISBN</label>
                        <input
                          name="isbn"
                          value={allData.isbn}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type isbn"
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="col-form-label">Edition</label>
                        <input
                          name="edition"
                          value={allData.edition}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="item edition"
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="col-form-label">Number of Page</label>
                        <input
                          name="number_of_page"
                          value={allData.number_of_page}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type number of page"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className=" col-form-label">Summery</label>

                        <textarea
                          name="summary"
                          value={allData.summary}
                          onChange={handleChange}
                          rows="8"
                          cols="5"
                          className="form-control"
                          placeholder="Item Summery"
                        ></textarea>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="col-form-label">Video Url</label>
                        <input
                          name="video_url"
                          value={allData.video_url}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Video Url: Youtube link"
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="col-form-label">
                          Brochure (PDF Only)
                        </label>
                        <input
                          name="brochure"
                          value={allData.brochure}
                          onChange={handleChange}
                          type="file"
                          accept="application/pdf"
                          className="form-control"
                          placeholder="Type number of page"
                        />
                      </div>

                      <div className="col-sm-3">
                        <label htmlFor="imageUpladFile">
                          <img
                            className="py-2"
                            src={filePreview}
                            style={{
                              width: "120px",
                              border: "2px dashed #90b85c",
                              cursor: "pointer",
                            }}
                            alt=""
                          />
                        </label>
                        <input
                          id="imageUpladFile"
                          type="file"
                          className="form-control"
                          onChange={(e) => {
                            handelImage(e);
                          }}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
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
                  {/* ------------------Right side-------------------- */}
                  <div className={`col-md-3 ${classes.dropdownSec}`}>
                    <div className="">
                      <label className=" col-form-label">Authors</label>
                      <Select
                        ref={select2Ref}
                        className="basic-single"
                        classNamePrefix="select Authors"
                        isLoading={false}
                        isClearable={true}
                        isSearchable={true}
                        name="item_authors"
                        defaultValue={allData.item_authors}
                        onChange={onInputChange}
                        isMulti={true}
                        getOptionValue={(option) => `${option["id"]}`}
                        getOptionLabel={(option) => `${option["name"]}`}
                        options={authors}
                      />
                      {/* <select
                        name="item_authors"
                        onChange={handleChange}
                        defaultValue={allData.item_authors}
                        className="form-control"
                        multiple={true}
                      >
                        <option key="0" value="">
                          Select Category
                        </option>
                        {authors?.map((author, i) => (
                          <option key={i + 1} value={author?.id}>
                            {author?.name}
                          </option>
                        ))}
                      </select> */}
                    </div>
                    <div className="">
                      <label className=" col-form-label">Publisher</label>
                      <select
                        name="publisher_id"
                        onChange={handleChange}
                        defaultValue={allData.publisher_id}
                        className="form-control"
                      >
                        <option key="0" value="">
                          Select Publisher
                        </option>
                        {publishers?.map((publisher, i) => (
                          <option key={i + 1} value={publisher?.id}>
                            {publisher?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="">
                      <label className=" col-form-label">Language</label>
                      <select
                        name="language_id"
                        onChange={handleChange}
                        defaultValue={allData.language_id}
                        className="form-control"
                      >
                        <option key="0" value="">
                          Select Language
                        </option>
                        {languages?.map((language, i) => (
                          <option key={i + 1} value={language?.id}>
                            {language?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="">
                      <label className=" col-form-label">Country</label>
                      <select
                        name="country_id"
                        onChange={handleChange}
                        defaultValue={allData.country_id}
                        className="form-control"
                      >
                        <option key="0" value="">
                          Select Country
                        </option>
                        {countries?.map((country, i) => (
                          <option key={i + 1} value={country?.id}>
                            {country?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="">
                      <label className=" col-form-label">Category</label>
                      <select
                        name="category_id"
                        onChange={handleChange}
                        defaultValue={allData.category_id}
                        className="form-control"
                      >
                        <option key="0" value="">
                          Select Category
                        </option>
                        {categories?.map((category, i) => (
                          <option key={i + 1} value={category?.id}>
                            {category?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="">
                      <label className=" col-form-label">Sub Category</label>
                      <select
                        name="sub_category_id"
                        onChange={handleChange}
                        value={allData.sub_category_id}
                        className="form-control"
                      >
                        <option key="0" value="">
                          Select Sub Category
                        </option>
                        {subCategories?.map((subCategory, i) => (
                          <option key={i + 1} value={subCategory?.id}>
                            {subCategory?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="">
                      <label className=" col-form-label">Item Status</label>
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
                    <div className="">
                      <label className=" col-form-label">Publish Status</label>
                      <select
                        name="publish_status"
                        onChange={handleChange}
                        defaultValue={allData.publish_status}
                        className="form-control"
                      >
                        <option value="">Select One</option>
                        <option value="1">Publish</option>
                        <option value="0">Unpublish</option>
                      </select>
                    </div>
                    <div className="">
                      <label className=" col-form-label">Show at Home?</label>
                      <select
                        name="show_home"
                        onChange={handleChange}
                        defaultValue={allData.show_home}
                        className="form-control"
                      >
                        <option value="">Select One </option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                    <div className="">
                      <label className=" col-form-label">Sequence</label>
                      <input
                        name="sequence"
                        value={allData.sequence}
                        onChange={handleChange}
                        type="number"
                        min={0}
                        max={999999}
                        className="form-control"
                        placeholder=""
                      />
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
