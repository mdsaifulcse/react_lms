import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useVendorApi from "./useVendorApi";
import defaultImage from "../../../assets/image/default_image.jpg";

export default function CreateEditModal({
  data: vendorData,
  show,
  onHide,
  headTitle,
  loadListData,
}) {
  const { onError, onSuccess } = useToster();
  const { getVendorMaxSequence, createVendorRequest, updateVendorRequest } =
    useVendorApi();

  const initialFormData = {
    id: "",
    name: "",
    status: 1,
    show_home: 0,
    sequence: 0,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [vendorPhoto, setVendorPhoto] = useState(null);

  //  Get sequence number-----------------------------
  const { data: maxSequenceData, refetch } = useQuery(
    "getVendorMaxSequence",
    getVendorMaxSequence,
    {
      //onSuccess: onSuccess,
      onError: onError,
      refetchOnWindowChange: true,
    }
  );

  const updateInitialValue = async (vendorData) => {
    initialFormData.id = vendorData.id ? vendorData.id : "";
    initialFormData.name = vendorData.name ? vendorData.name : "";
    initialFormData.status = vendorData.status ? vendorData.status : 0;
    initialFormData.show_home = vendorData.show_home ? vendorData.show_home : 0;
    initialFormData.sequence = vendorData.sequence ? vendorData.sequence : 0;
    await setAllData({ ...allData, ...initialFormData });
  };

  useEffect(() => {
    // set data for edit ---------------------
    if (Object.keys(vendorData).length > 0) {
      updateInitialValue(vendorData);
    } else {
      // For create ----
      const vendorData = {};
      vendorData.status = 1;
      vendorData.sequence = maxSequenceData?.data?.result?.sequence;
      updateInitialValue(vendorData);
    }
  }, [vendorData]);

  const handleChange = async (e, initialFormData) => {
    if (e) {
      // on user change -----
      setAllData({ ...allData, [e.target.name]: e.target.value });
    }
  };
  // on Image change -----
  function handelImage(e) {
    setVendorPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "createVendorRequest",
    createVendorRequest,
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
    formData.append("name", allData.name);
    formData.append("show_home", allData.show_home);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);
    // Edit ----------------------------
    if (allData.id) {
      formData.append("_method", "PUT");
      const response = await updateVendorRequest(formData, allData.id);
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
    //return navigate("/admin/publishers/list", { replace: true });
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
                              <label className="col-sm-3 col-form-label">
                                Vendor Name
                              </label>
                              <div className="col-sm-9">
                                <input
                                  name="name"
                                  type="text"
                                  value={allData.name}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Type Vendor name"
                                />
                              </div>
                            </div>

                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label"></label>
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
                                <label className=" col-form-label">
                                  Status
                                </label>
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
                                <label className=" col-form-label">
                                  Sequence
                                </label>
                              </div>
                            </div>

                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label"></label>

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
                              <label className="col-md-3 col-form-label"></label>
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
