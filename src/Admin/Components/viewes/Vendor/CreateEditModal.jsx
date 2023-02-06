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
    mobile: "",
    email: "",
    contact_person: "",
    contact_person_mobile: "",
    office_address: "",
    warehouse_address: "",
    primary_supply_products: "",
    status: 1,
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
    initialFormData.mobile = vendorData.mobile ? vendorData.mobile : "";
    initialFormData.email = vendorData.email ? vendorData.email : "";
    initialFormData.contact_person = vendorData.contact_person
      ? vendorData.contact_person
      : "";
    initialFormData.contact_person_mobile = vendorData.contact_person_mobile
      ? vendorData.contact_person_mobile
      : "";
    initialFormData.office_address = vendorData.office_address
      ? vendorData.office_address
      : "";
    initialFormData.warehouse_address = vendorData.warehouse_address
      ? vendorData.warehouse_address
      : "";
    initialFormData.primary_supply_products = vendorData.primary_supply_products
      ? vendorData.primary_supply_products
      : "";
    initialFormData.status = vendorData.status ? vendorData.status : 0;
    initialFormData.sequence = vendorData.sequence ? vendorData.sequence : 0;
    await setAllData({ ...allData, ...initialFormData });
    await setFilePreview(vendorData.photo ? vendorData.photo : defaultImage);
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

    if (vendorPhoto) {
      formData.append("photo", vendorPhoto);
    }

    formData.append("id", allData.id);
    formData.append("name", allData.name);
    formData.append("mobile", allData.mobile);
    formData.append("email", allData.email);
    formData.append("contact_person", allData.contact_person);
    formData.append("contact_person_mobile", allData.contact_person_mobile);
    formData.append("office_address", allData.office_address);
    formData.append("warehouse_address", allData.warehouse_address);
    formData.append("primary_supply_products", allData.primary_supply_products);
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
                              <div className="col-sm-6">
                                <label className="col-form-label">Name</label>
                                <input
                                  name="name"
                                  type="text"
                                  value={allData.name}
                                  onChange={handleChange}
                                  className="form-control"
                                  required
                                  placeholder="Type Vendor name"
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="col-form-label">Mobile</label>
                                <input
                                  name="mobile"
                                  type="text"
                                  value={allData.mobile}
                                  onChange={handleChange}
                                  className="form-control"
                                  required
                                  placeholder="Type Vendor Mobile"
                                />
                              </div>
                            </div>
                            {/* End row */}
                            <div className="form-group row">
                              <div className="col-sm-6">
                                <label className="col-form-label">Email</label>
                                <input
                                  name="email"
                                  type="text"
                                  value={allData.email}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Type Vendor Email"
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Contact Person
                                </label>
                                <input
                                  name="contact_person"
                                  type="text"
                                  value={allData.contact_person}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Vendor's Contact Person"
                                />
                              </div>
                            </div>
                            {/* End row */}
                            <div className="form-group row">
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Contact Person Mobile
                                </label>
                                <input
                                  name="contact_person_mobile"
                                  type="text"
                                  value={allData.contact_person_mobile}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Contact Person's Mobile"
                                />
                              </div>
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Primary Supply Products
                                </label>
                                <input
                                  name="primary_supply_products"
                                  type="text"
                                  value={allData.primary_supply_products}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Vendor's Primary Supply Products "
                                />
                              </div>
                            </div>
                            {/* End row */}
                            <div className="form-group row">
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Office Address
                                </label>
                                <textarea
                                  name="office_address"
                                  value={allData.office_address}
                                  onChange={handleChange}
                                  rows="4"
                                  className="form-control"
                                  placeholder="Type Office Address Here"
                                ></textarea>
                              </div>
                              <div className="col-sm-6">
                                <label className="col-form-label">
                                  Warehouse Address
                                </label>
                                <textarea
                                  name="warehouse_address"
                                  value={allData.warehouse_address}
                                  onChange={handleChange}
                                  rows="4"
                                  className="form-control"
                                  placeholder="Type Warehouse address Here"
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
