import { useState, useEffect } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemApi from "./useItemApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import classes from "./Style/Item.module.css";

import { Link } from "react-router-dom";
export default function CreateItem() {
  const { onError, onSuccess } = useToster();
  const { getItemMaxSequence, createItemRequest } = useItemApi();
  const initialFormData = {
    title: "",
    email: "",
    mobile: "",
    photo: defaultImage,
    contact: "",
    address1: "",
    address2: "",
    bio: "",
    show_home: 0,
    status: 1,
    sequence: 0,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [authorPhoto, setAuthorPhoto] = useState(null);

  const { data: maxSequenceData, refetch } = useQuery(
    "getItemMaxSequence",
    getItemMaxSequence,
    {
      //onSuccess: onSuccess,
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    handleChange("", maxSequenceData?.data?.result?.sequence);
  }, [maxSequenceData]);

  const handleChange = (e, maxSequenceData) => {
    if (maxSequenceData) {
      // when api response -----
      setAllData({
        ...allData,
        sequence: maxSequenceData,
      });
    }

    if (e) {
      // on user change -----
      setAllData({ ...allData, [e.target.name]: e.target.value });
    }
  };

  function handelImage(e) {
    setAuthorPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation("createItemRequest", createItemRequest, {
    onSuccess: onSuccess,
    onError: onError,
  });

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (authorPhoto) {
      formData.append("photo", authorPhoto);
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
                  {/* Left side  */}
                  <div className={`col-md-9 ${classes.inputSec} }`}>
                    <div className=" row">
                      <div className="col-sm-9">
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
                      <div className="col-sm-3">
                        <label className="col-form-label">ISBN</label>
                        <input
                          name="email"
                          value={allData.email}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type item email"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-10">
                        <label className="col-form-label">ISBN</label>
                        <input
                          name="email"
                          value={allData.email}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type item email"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Mobile</label>
                      <div className="col-sm-10">
                        <input
                          name="mobile"
                          value={allData.mobile}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type item mobile"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Contact</label>
                      <div className="col-sm-10">
                        <input
                          name="contact"
                          value={allData.contact}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type Item contact"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Bio</label>
                      <div className="col-sm-10">
                        <textarea
                          name="bio"
                          value={allData.bio}
                          onChange={handleChange}
                          rows="5"
                          cols="5"
                          className="form-control"
                          placeholder="Item Bio is here"
                        ></textarea>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Address</label>
                      <div className="col-sm-10">
                        <textarea
                          name="address1"
                          value={allData.address1}
                          onChange={handleChange}
                          rows="5"
                          cols="5"
                          className="form-control"
                          placeholder="Item address is here"
                        ></textarea>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-sm-3">
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
                        <label className=" col-form-label">Status</label>
                      </div>

                      <div className="col-sm-3">
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
                        <label className=" col-form-label">Show at Home?</label>
                      </div>

                      <div className="col-sm-3">
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
                        <label className=" col-form-label">Sequence</label>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        Upload File
                      </label>
                      <div className="col-sm-5">
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
                      </div>

                      <div className="col-sm-5">
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

                    <div className="form-group row">
                      <label className="col-md-2 col-form-label"></label>
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

                  <div className={`col-md-3 ${classes.dropdownSec}`}>
                    <h1>Good</h1>
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
