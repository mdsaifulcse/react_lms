import { useState, useEffect } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import usePublisherApi from "./usePublisherApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import Loading from "../../ui-component/Loading";

import { Link, useParams } from "react-router-dom";
export default function EditPublisher() {
  const initialFormData = {
    id: null,
    name: "",
    email: "",
    mobile: "",
    photo: "",
    contact: "",
    address1: "",
    address2: "",
    bio: "",
    show_home: 0,
    status: 1,
    sequence: 0,
    _method: "PUT",
  };
  const { publisherId } = useParams();
  const { onError, onSuccess } = useToster();
  const { showPublisherRequest, updatePublisherRequest } = usePublisherApi();
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [publisherPhoto, setPublisherPhoto] = useState(null);

  // get & set publisher data ----------
  const { data, isLoading } = useQuery(
    ["showPublisherRequest", parseInt(publisherId)],
    showPublisherRequest,
    {
      //onSuccess: onSuccess,
      onError: onError,
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const updateInitialValue = async (publisher) => {
    initialFormData.id = publisher.id;
    initialFormData.name = publisher.name ? publisher.name : "";
    initialFormData.email = publisher.email ? publisher.email : "";
    initialFormData.mobile = publisher.mobile ? publisher.mobile : "";
    initialFormData.contact = publisher.contact ? publisher.contact : "";
    initialFormData.address1 = publisher.address1 ? publisher.address1 : "";
    initialFormData.address2 = publisher.address2 ? publisher.address2 : "";
    initialFormData.bio = publisher.bio ? publisher.bio : "";
    initialFormData.show_home = publisher.show_home ? publisher.show_home : "";
    initialFormData.status = publisher.status ? publisher.status : 0;
    initialFormData.sequence = publisher.sequence ? publisher.sequence : "";
    await setFilePreview(publisher.photo ? publisher.photo : defaultImage);
    await setAllData(initialFormData);
  };
  useEffect(() => {
    let publisher = [];
    if (!isLoading) {
      publisher = data.data.result;
      updateInitialValue(publisher);
    }
  }, [isLoading]);

  // on field value change -----
  const handleChange = (e) => {
    // on user change -----
    setAllData({ ...allData, [e.target.name]: e.target.value });
  };

  // on Image change -----
  function handelImage(e) {
    setPublisherPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (publisherPhoto) {
      formData.append("photo", publisherPhoto);
    }

    formData.append("id", allData.id);
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
    formData.append("_method", "PUT");

    const response = await updatePublisherRequest(formData, publisherId);
    if (response.status === 200) {
      await onSuccess(response);
      //await customOnSuccess("Update");
    } else {
      await onError(response);
    }

    //return navigate("/admin/publishers/list", { replace: true });
  };

  return (
    <>
      <PageHeader pageTitle={"Edit Publisher"} actionPage={"Publisher"} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5> Edit Publisher Info Here </h5>

                  <span></span>
                  <div className="card-header-right">
                    <Link to="/admin/publishers/list" title="Publisher list">
                      Publisher List <i className="icofont icofont-list"></i>
                    </Link>
                  </div>
                </div>
                <div className="card-block">
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                      >
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Name
                          </label>
                          <div className="col-sm-10">
                            <input
                              name="name"
                              value={allData.name}
                              onChange={handleChange}
                              type="text"
                              className="form-control"
                              placeholder="Type Publisher name"
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Email
                          </label>
                          <div className="col-sm-10">
                            <input
                              name="email"
                              value={allData.email}
                              onChange={handleChange}
                              type="text"
                              className="form-control"
                              placeholder="Type Publisher email"
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Mobile
                          </label>
                          <div className="col-sm-10">
                            <input
                              name="mobile"
                              value={allData.mobile}
                              onChange={handleChange}
                              type="text"
                              className="form-control"
                              placeholder="Type Publisher mobile"
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Contact
                          </label>
                          <div className="col-sm-10">
                            <input
                              name="contact"
                              value={allData.contact}
                              onChange={handleChange}
                              type="text"
                              className="form-control"
                              placeholder="Type Publisher contact"
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
                          <label className="col-sm-2 col-form-label">
                            Address
                          </label>
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
                              value={allData.status}
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
                            <label className=" col-form-label">
                              Show at Home?
                            </label>
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
                            Upload Photo
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
