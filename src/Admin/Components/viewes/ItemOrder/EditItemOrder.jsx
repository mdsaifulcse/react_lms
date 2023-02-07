import { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemApi from "./useItemOrderApi";
import Loading from "../../ui-component/Loading";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/ItemOrder.module.css";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import JoditEditor from "jodit-react";

export default function EditItemOrder() {
  const { itemId } = useParams();
  const itemEditor = useRef(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/,
    placeholder: "Item summery here",
  };
  const select2Ref = useRef();
  const { onError, onSuccess } = useToster();
  const {
    showItemRequest,
    updateItemRequest,
    activeCategoriesRequest,
    activeSubCategoriesByCategoryRequest,
    activeThirdSubCategoriesBySubCategoryRequest,
    activeAuthorListRequest,
    activeCountryListRequest,
    activeLanguageListRequest,
    activePublisherListRequest,
  } = useItemApi();
  const initialFormData = {
    id: "",
    title: "",
    isbn: "",
    edition: "",
    photo: defaultImage,
    number_of_page: "",
    summary: "",
    video_url: "",
    brochure: "",
    item_authors: [],
    publisherSetOptions: "",
    languageSetOptions: "",
    countrySetOptions: "",
    categorySetOptions: "",
    subCategorySetOptions: "",
    thirdCategorySetOptions: "",
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
  const [thirdSubCategories, setThirdSubCategories] = useState([]);
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
  useQuery("activeAuthorListRequest", activeAuthorListRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setAuthors(response.data.result);
        //let authorOptions = makeSelectedOptions(response.data.result);
        //console.log(authorOptions);
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
  useQuery("activeCategoriesRequest", activeCategoriesRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setCategories(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowChange: false,
  });
  //  Get sub-categories Data by categoryId-----------------------------
  const { refetch: subCategoryRefech } = useQuery(
    [
      "activeSubCategoriesByCategoryRequest",
      Object.keys(allData.categorySetOptions).length > 0
        ? allData.categorySetOptions.id
        : "",
    ],
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

  //  Get Third-sub-categories Data by categoryId-----------------------------
  const { refetch: thirdSubCategoryRefech } = useQuery(
    [
      "activeThirdSubCategoriesBySubCategoryRequest",
      Object.keys(allData.subCategorySetOptions).length > 0
        ? allData.subCategorySetOptions.id
        : "",
    ],
    activeThirdSubCategoriesBySubCategoryRequest,
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          await setThirdSubCategories(response.data.result);
        }
      },
      onError: onError,
      refetchOnWindowChange: false,
      enabled: true,
    }
  );
  // get & set Edit Item data ----------
  const {
    data,
    isLoading: loadItem,
    isError,
  } = useQuery(["showItemRequest", parseInt(itemId)], showItemRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const updateInitialValue = async (item) => {
    initialFormData.id = item.id;
    initialFormData.title = item.title;
    initialFormData.isbn = item.isbn;
    initialFormData.edition = item.edition;
    initialFormData.photo = defaultImage;
    initialFormData.number_of_page = item.number_of_page;
    initialFormData.summary = item.summary;
    initialFormData.video_url = item.video_url;
    //initialFormData.brochure = item.brochure;
    initialFormData.item_authors = item.relItemAuthorsName;
    initialFormData.publisher_id = item.publisher_id;
    initialFormData.publisherSetOptions = item.publisher_id
      ? { id: item.publisher_id, name: item.publisher }
      : "";
    initialFormData.languageSetOptions = item.language_id
      ? { id: item.language_id, name: item.language }
      : "";
    initialFormData.countrySetOptions = item.country_id
      ? { id: item.country_id, name: item.country }
      : "";
    initialFormData.categorySetOptions = item.category_id
      ? { id: item.category_id, name: item.category }
      : "";
    initialFormData.subCategorySetOptions = item.sub_category_id
      ? { id: item.sub_category_id, name: item.sub_category }
      : "";
    initialFormData.thirdCategorySetOptions = item.third_category_id
      ? { id: item.third_category_id, name: item.third_category }
      : "";
    initialFormData.show_home = item.show_home;
    initialFormData.status = item.status;
    initialFormData.publish_status = item.publisher_id;
    initialFormData.sequence = item.sequence;

    await setFilePreview(
      item.itemThumbnails ? item.itemThumbnails[0].medium : defaultImage
    );
    await setAllData(initialFormData);
  };
  useEffect(() => {
    let item = {};
    if (!loadItem && !isError) {
      //loadItemAfterUpdate
      item = data.data.result;
      updateInitialValue(item);
    }
  }, [loadItem]);

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
  function handleTextEditorChange(textEditorData) {
    setAllData({ ...allData, ["summary"]: textEditorData });
  }

  const onInputChange = async (selectedOptions, select2Ref) => {
    if (Array.isArray(selectedOptions)) {
      // For array Object------
      let selectedIds = [];
      selectedOptions.map((item, i) => {
        selectedIds.push(item);
      });

      setAllData({
        ...allData,
        [select2Ref.name]: selectedIds,
      });
    } else {
      // For single object -----------------------------------
      // For load thirdSubCategory by subCategory ------------
      if (select2Ref.name === "subCategorySetOptions") {
        await thirdSubCategoryRefech();
      }
      if (select2Ref.name === "categorySetOptions") {
        // For Reset subCategory & ThirdSubCategory ----
        setAllData({
          ...allData,
          [select2Ref.name]: selectedOptions,
          subCategorySetOptions: {},
          thirdCategorySetOptions: {},
        });
        await setSubCategories([]);
        await setThirdSubCategories([]);
        await subCategoryRefech();
      } else {
        setAllData({
          ...allData,
          [select2Ref.name]: selectedOptions,
        });
      }
    }
  };

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation("updateItemRequest", updateItemRequest, {
    onSuccess: onSuccess,
    onError: onError,
  });

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(allData.publisherSetOptions.length);
    console.log(allData);
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

    formData.append(
      "publisher_id",
      Object.keys(allData.publisherSetOptions).length > 0
        ? allData.publisherSetOptions.id
        : ""
    );
    formData.append(
      "language_id",
      Object.keys(allData.languageSetOptions).length > 0
        ? allData.languageSetOptions.id
        : ""
    );
    formData.append(
      "country_id",
      Object.keys(allData.countrySetOptions).length > 0
        ? allData.countrySetOptions.id
        : ""
    );
    formData.append(
      "category_id",
      Object.keys(allData.categorySetOptions).length > 0
        ? allData.categorySetOptions.id
        : ""
    );
    formData.append(
      "sub_category_id",
      Object.keys(allData.subCategorySetOptions).length > 0
        ? allData.subCategorySetOptions.id
        : ""
    );
    formData.append(
      "third_category_id",
      Object.keys(allData.thirdCategorySetOptions).length > 0
        ? allData.thirdCategorySetOptions.id
        : ""
    );
    formData.append("show_home", allData.show_home);
    formData.append("publish_status", allData.publish_status);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);
    formData.append("_method", "PUT");

    const response = await updateItemRequest(formData, itemId);
    if (response.status === 200) {
      await onSuccess(response);
      //await customOnSuccess("Update");
    } else {
      await onError(response);
    }
    //return navigate("/admin/items/list", { replace: true });
  };

  return (
    <>
      {loadItem ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Edit Item info"} actionPage={"Edit Item"} />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5> Edit New Item Here </h5>

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
                      {/* ------------------left side-----------------------  */}
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
                              required
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
                            <label className="col-form-label">
                              Number of Page
                            </label>
                            <input
                              name="number_of_page"
                              value={allData.number_of_page}
                              onChange={handleChange}
                              type="number"
                              className="form-control"
                              placeholder="Type number of page"
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-sm-12">
                            <label className=" col-form-label">Summary</label>
                            <JoditEditor
                              ref={itemEditor}
                              name="summary"
                              value={allData.summary}
                              onBlur={handleTextEditorChange}
                              config={config}
                              tabIndex={30} // tabIndex of textarea
                            />

                            {/* <textarea
                          name="summary"
                          value={allData.summary}
                          onChange={handleChange}
                          rows="8"
                          cols="5"
                          className="form-control"
                          placeholder="Item Summery"
                        ></textarea> */}
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
                              onChange={handelFile}
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
                            classNamePrefix="select Authors"
                            onChange={onInputChange}
                            isMulti={true}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            name="item_authors"
                            value={allData.item_authors}
                            options={authors}
                            required
                          />
                        </div>
                        <div className="">
                          <label className=" col-form-label">Publisher</label>
                          <Select
                            ref={select2Ref}
                            isClearable={false}
                            onChange={onInputChange}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            name="publisherSetOptions"
                            value={allData.publisherSetOptions}
                            options={publishers}
                            placeholder="Select Publisher"
                          />

                          {/* 
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
                      </select> */}
                        </div>
                        <div className="">
                          <label className=" col-form-label">Language</label>
                          <Select
                            ref={select2Ref}
                            onChange={onInputChange}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            value={allData.languageSetOptions}
                            name="languageSetOptions"
                            options={languages}
                            placeholder="Select Language"
                          />
                        </div>
                        <div className="">
                          <label className=" col-form-label">Country</label>
                          <Select
                            ref={select2Ref}
                            onChange={onInputChange}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            value={allData.countrySetOptions}
                            name="countrySetOptions"
                            options={countries}
                            placeholder="Select Country"
                          />
                        </div>
                        <div className="">
                          <label className=" col-form-label">Category</label>
                          <Select
                            ref={select2Ref}
                            onChange={onInputChange}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            value={allData.categorySetOptions}
                            name="categorySetOptions"
                            options={categories}
                            required
                            placeholder="Select Category"
                          />
                        </div>
                        <div className="">
                          <label className=" col-form-label">
                            Sub Category
                          </label>
                          <Select
                            ref={select2Ref}
                            onChange={onInputChange}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            value={allData.subCategorySetOptions}
                            name="subCategorySetOptions"
                            options={subCategories}
                            required
                            placeholder="Select Sub Category"
                          />
                        </div>
                        <div className="">
                          <label className=" col-form-label">
                            Third Sub Category
                          </label>
                          <Select
                            ref={select2Ref}
                            onChange={onInputChange}
                            getOptionValue={(option) => `${option["id"]}`}
                            getOptionLabel={(option) => `${option["name"]}`}
                            value={allData.thirdCategorySetOptions}
                            name="thirdCategorySetOptions"
                            options={thirdSubCategories}
                            placeholder="Third Sub Category"
                          />
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
                          <label className=" col-form-label">
                            Publish Status
                          </label>
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
                          <label className=" col-form-label">
                            Show at Home?
                          </label>
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
      )}
    </>
  );
}
