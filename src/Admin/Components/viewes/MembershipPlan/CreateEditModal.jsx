import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useMembershipPlanApi from "./useMembershipPlanApi";
import defaultImage from "../../../assets/image/default_image.jpg";

export default function CreateEditModal({
  data: planData,
  show,
  onHide,
  headTitle,
  loadListData,
}) {
  const { onError, onSuccess } = useToster();
  const {
    getMembershipPlanMaxSequence,
    createMembershipPlanRequest,
    updateMembershipPlanRequest,
  } = useMembershipPlanApi();

  const initialFormData = {
    id: "",
    name: "",
    valid_duration: 0,
    fee_amount: 0,
    description: "",
    term_policy: "",
    image: "",
    status: 1,
    sequence: 0,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [uploadImage, setUploadImage] = useState(null);

  //  Get sequence number-----------------------------
  const { data: maxSequenceData, refetch } = useQuery(
    "getMembershipPlanMaxSequence",
    getMembershipPlanMaxSequence,
    {
      //onSuccess: onSuccess,
      onError: onError,
      refetchOnWindowChange: true,
    }
  );

  const updateInitialValue = async (vendorData) => {
    initialFormData.id = vendorData.id ? vendorData.id : "";
    initialFormData.name = vendorData.name ? vendorData.name : "";
    initialFormData.valid_duration = vendorData.valid_duration
      ? vendorData.valid_duration
      : "";
    initialFormData.fee_amount = vendorData.fee_amount
      ? vendorData.fee_amount
      : "";
    initialFormData.description = vendorData.description
      ? vendorData.description
      : "";
    initialFormData.term_policy = vendorData.term_policy
      ? vendorData.term_policy
      : "";

    initialFormData.status = vendorData.status ? vendorData.status : 0;
    initialFormData.sequence = vendorData.sequence ? vendorData.sequence : 0;
    await setAllData({ ...allData, ...initialFormData });
    await setFilePreview(vendorData.image ? vendorData.image : defaultImage);
  };

  useEffect(() => {
    // set data for edit ---------------------
    if (Object.keys(planData).length > 0) {
      updateInitialValue(planData);
    } else {
      // For create ----
      const planData = {};
      planData.status = 1;
      planData.sequence = maxSequenceData?.data?.result?.sequence;
      updateInitialValue(planData);
    }
  }, [planData]);

  const handleChange = async (e, initialFormData) => {
    if (e) {
      // on user change -----
      setAllData({ ...allData, [e.target.name]: e.target.value });
    }
  };
  // on Image change -----
  function handelImage(e) {
    setUploadImage(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Create Api MutateAsync --------------
  const { mutateAsync, isLoading: submitLoader } = useMutation(
    "createMembershipPlanRequest",
    createMembershipPlanRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle (Create Or Edit)--------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    formData.append("id", allData.id);
    formData.append("name", allData.name);
    formData.append("valid_duration", allData.valid_duration);
    formData.append("fee_amount", allData.fee_amount);
    formData.append("description", allData.description);
    formData.append("term_policy", allData.term_policy);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);
    // Edit ----------------------------
    if (allData.id) {
      formData.append("_method", "PUT");
      const response = await updateMembershipPlanRequest(formData, allData.id);
      if (response.status === 200) {
        await onSuccess(response);
      } else {
        await onError(response);
      }
    } else {
      // Create ------------------------
      await mutateAsync(formData);
      setAllData(initialFormData);
      await refetch();
    }

    // Refetch all Data after edit or create action done --
    await loadListData();
    //return navigate("/admin/membership-plans/list", { replace: true });
  };

  return (
    <>
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {headTitle}
          </Modal.Title>
          <span onClick={onHide} role="button" className="text-danger">
            X
          </span>
        </Modal.Header>

        <Modal.Body>
          <div className="card">
            <div className="card-header">
              {/* <h5 className="card-header-text">Language Info ({data.name})</h5> */}
            </div>
            <div className="card-block">
              <div className="view-info">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="general-info">
                      <div className="row">
                        {/* <!-- end of table col-lg-6 --> */}
                        <div className="col-lg-12 col-xl-12">
                          <form onSubmit={handleSubmit}>
                            <div className="form-group row">
                              <div className="col-sm-12">
                                <label className="col-form-label">Name</label>
                                <input
                                  name="name"
                                  type="text"
                                  value={allData.name}
                                  onChange={handleChange}
                                  className="form-control"
                                  required
                                  placeholder="Plan name"
                                />
                              </div>
                            </div>
                            {/* End row */}
                            <div className="form-group row">
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Fee Amount
                                </label>
                                <input
                                  name="fee_amount"
                                  type="number"
                                  value={allData.fee_amount}
                                  min={0}
                                  max={99999}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Fee Amount"
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Valid Duration
                                </label>
                                <input
                                  name="valid_duration"
                                  type="number"
                                  value={allData.valid_duration}
                                  onChange={handleChange}
                                  className="form-control"
                                  min={0}
                                  max={99999}
                                  required
                                  placeholder="Valid Duration"
                                />
                              </div>
                            </div>

                            <div className="form-group row">
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Description
                                </label>
                                <textarea
                                  name="description"
                                  value={allData.description}
                                  onChange={handleChange}
                                  rows="4"
                                  className="form-control"
                                  placeholder="Plan Description"
                                ></textarea>
                              </div>
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Term Policy
                                </label>
                                <textarea
                                  name="term_policy"
                                  value={allData.term_policy}
                                  onChange={handleChange}
                                  rows="4"
                                  className="form-control"
                                  placeholder="Type Term Policy"
                                ></textarea>
                              </div>
                            </div>
                            {/* End row */}

                            <div className="form-group row">
                              <div className="col-sm-3">
                                <select
                                  name="status"
                                  onChange={handleChange}
                                  value={allData.status}
                                  className="form-control"
                                  required
                                >
                                  <option value="">Select One</option>
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </select>
                                <label className=" col-form-label">
                                  Status
                                </label>
                              </div>
                              {/* <div className="col-sm-3">
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
                              </div> */}

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
                                  required
                                />
                                <label className=" col-form-label">
                                  Sequence
                                </label>
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
                                <br />
                                <label className="col-form-label">
                                  Vendoe Photo
                                </label>
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
                            </div>

                            <div className="form-group row">
                              <label className="col-md-2 col-form-label">
                                {submitLoader ? (
                                  <button
                                    type="button"
                                    className="btn btn-default btn-md btn-block waves-effect text-center m-b-20"
                                  >
                                    Submiting...
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
                        {/* <!-- end of table col-lg-6 --> */}
                      </div>
                      {/* <!-- end of row --> */}
                    </div>
                    {/* <!-- end of general info --> */}
                  </div>
                  {/* <!-- end of col-lg-12 --> */}
                </div>
                {/* <!-- end of row --> */}
              </div>
              {/* <!-- end of view-info --> */}
            </div>
            {/* <!-- end of card-block --> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={onHide} className="btn btn-danger">
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
