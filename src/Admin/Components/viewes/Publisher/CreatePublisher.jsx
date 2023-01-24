import { Fragment, useState, useEffect } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useAuthorApi from "./usePublisherApi";
import defaultImage from "../../../assets/image/default_image.jpg";

import { Link } from "react-router-dom";
export default function CreateAuthor() {
  const { onError, onSuccess } = useToster();
  const { getPublisherMaxSequence, createPublisherRequest } = useAuthorApi();
  const initialFormData = {
    name: "",
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
  const [publisherPhoto, setPublisherPhoto] = useState(null);

  const { data: maxSequenceData, refetch } = useQuery(
    "getPublisherMaxSequence",
    getPublisherMaxSequence,
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
    setPublisherPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "createPublisherRequest",
    createPublisherRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (publisherPhoto) {
      formData.append("photo", publisherPhoto);
    }

    formData.append("name", allData.name);
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
    //return navigate("/admin/publishers/list", { replace: true });
  };

  return (
    <>
      <PageHeader pageTitle={"Create publisher"} actionPage={" publisher"} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5> Create New Publisher Here </h5>

              <span></span>
              <div className="card-header-right">
                {/* <i className="icofont icofont-refresh"></i> */}
                <Link to="/admin/publishers/list" title="Publisher list">
                  Publisher List <i className="icofont icofont-list"></i>
                </Link>
              </div>
            </div>
            <div className="card-block">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Name</label>
                      <div className="col-sm-10">
                        <input
                          name="name"
                          value={allData.name}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type publisher name"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Email</label>
                      <div className="col-sm-10">
                        <input
                          name="email"
                          value={allData.email}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type publisher email"
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
                          placeholder="Type publisher mobile"
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
                          placeholder="Type publisher contact"
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
                          placeholder="Publisher Bio is here"
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
                          placeholder="Publisher address is here"
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
                        Publisher Photo
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
                  </form>
                </div>
              </div>

              {/* <div className="row">
                <div className="col-sm-6">
                  <h4 className="sub-title">Input Sizes</h4>
                  <form>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder=".form-control-lg"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=".form-control"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder=".form-control-sm"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-sm-6 mobile-inputs">
                  <h4 className="sub-title">Color Inputs</h4>
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-primary"
                        placeholder=".form-control-primary"
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-warning"
                          placeholder=".form-control-warning"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-default"
                          placeholder=".form-control-default"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-danger"
                          placeholder=".form-control-danger"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-success"
                          placeholder=".form-control-success"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-inverse"
                          placeholder=".form-control-inverse"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-info"
                          placeholder=".form-control-info"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 mobile-inputs">
                  <h4 className="sub-title">Text-color</h4>
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-txt-primary"
                        placeholder=".form-txt-primary"
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-txt-warning"
                          placeholder=".form-txt-warning"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-txt-default"
                          placeholder=".form-txt-default"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-txt-danger"
                          placeholder=".form-txt-danger"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-txt-success"
                          placeholder=".form-txt-success"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-txt-inverse"
                          placeholder=".form-txt-inverse"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-txt-info"
                          placeholder=".form-txt-info"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-sm-6 mobile-inputs">
                  <h4 className="sub-title">Background-color</h4>
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-bg-primary"
                        placeholder=".form-bg-primary"
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-bg-warning"
                          placeholder=".form-bg-warning"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-bg-default"
                          placeholder=".form-bg-default"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-bg-danger"
                          placeholder=".form-bg-danger"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-bg-success"
                          placeholder=".form-bg-success"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-bg-inverse"
                          placeholder=".form-bg-inverse"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-bg-info"
                          placeholder=".form-bg-info"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
