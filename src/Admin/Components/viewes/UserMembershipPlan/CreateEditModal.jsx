import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useUserMembershipPlanApi from "./useUserMembershipPlanApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import Select from "react-select";

export default function CreateEditModal({
  data: planData,
  show,
  onHide,
  headTitle,
  loadListData,
  activeGeneralUser,
  activePlan,
}) {
  console.log(planData);
  const select2Ref = useRef();
  const { onError, onSuccess } = useToster();
  const { createUserMembershipPlanRequest, updateUserMembershipPlanRequest } =
    useUserMembershipPlanApi();

  const initialFormData = {
    id: "",
    user_id: "",
    userSetOptions: "",
    planSetOptions: "",
    membership_plan_id: 0,
    status: 1,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [uploadImage, setUploadImage] = useState(null);

  const updateInitialValue = async (planData) => {
    initialFormData.id = planData.id ? planData.id : "";
    initialFormData.user_id = planData.user_id ? planData.user_id : "";
    initialFormData.userSetOptions = {
      id: planData.user_id,
      name: planData.user_name,
    };
    initialFormData.planSetOptions = {
      id: planData.membership_plan_id,
      name: planData.membership_plan,
    };

    initialFormData.status = planData.status ? planData.status : 0;
    await setAllData({ ...allData, ...initialFormData });
  };

  useEffect(() => {
    // set data for edit ---------------------
    if (Object.keys(planData).length > 0) {
      updateInitialValue(planData);
    } else {
      // For create ----
      const planData = {};
      planData.status = 1;
      planData.userSetOptions = "";
      planData.planSetOptions = "";
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

  const onInputChange = async (selectedOptions, select2Ref) => {
    setAllData({
      ...allData,
      [select2Ref.name]: selectedOptions,
    });
  };

  // Create Api MutateAsync --------------
  const { mutateAsync, isLoading: submitLoader } = useMutation(
    "createUserMembershipPlanRequest",
    createUserMembershipPlanRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle (Create Or Edit)--------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id", allData.id);
    formData.append(
      "user_id",
      Object.keys(allData.userSetOptions).length > 0
        ? allData.userSetOptions.id
        : ""
    );
    formData.append(
      "membership_plan_id",
      Object.keys(allData.planSetOptions).length > 0
        ? allData.planSetOptions.id
        : ""
    );
    formData.append("status", allData.status);
    // Edit ----------------------------
    if (allData.id) {
      formData.append("_method", "PUT");
      const response = await updateUserMembershipPlanRequest(
        formData,
        allData.id
      );
      if (response.status === 200) {
        await onSuccess(response);
      } else {
        await onError(response);
      }
    } else {
      // Create ------------------------
      await mutateAsync(formData);
      setAllData(initialFormData);
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
                              <div className="col-sm-4">
                                <label className="col-form-label">
                                  User Name
                                </label>
                                <Select
                                  ref={select2Ref}
                                  classNamePrefix="select User"
                                  onChange={onInputChange}
                                  getOptionValue={(option) => `${option["id"]}`}
                                  getOptionLabel={(option) =>
                                    `${option["name"]}`
                                  }
                                  name="userSetOptions"
                                  value={allData.userSetOptions}
                                  options={activeGeneralUser}
                                />
                              </div>
                              <div className="col-sm-4">
                                <label className="col-form-label">
                                  Membership Plan
                                </label>
                                <Select
                                  ref={select2Ref}
                                  classNamePrefix="select User"
                                  onChange={onInputChange}
                                  getOptionValue={(option) => `${option["id"]}`}
                                  getOptionLabel={(option) =>
                                    `${option["name"]}`
                                  }
                                  name="planSetOptions"
                                  value={allData.planSetOptions}
                                  options={activePlan}
                                />
                              </div>
                              <div className="col-sm-4">
                                <label className=" col-form-label">
                                  {" "}
                                  Status
                                </label>
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
