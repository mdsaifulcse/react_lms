import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useSubCategoryApi from "./useSubCategoryApi";
import defaultImage from "../../../assets/image/default_image.jpg";

export default function CreateEditModal({
  data: subCategoryData,
  show,
  onHide,
  headTitle,
  loadListData,
}) {
  const { onError, onSuccess } = useToster();
  const {
    activeCategoriesRequest,
    getSubCategoryMaxSequence,
    createSubCategoryRequest,
    updateSubCategoryRequest,
  } = useSubCategoryApi();

  const initialFormData = {
    id: "",
    category_id: "",
    name: "",
    status: 1,
    show_home: 0,
    sequence: 0,
  };

  // Initial State ----------------------------------------
  const [allData, setAllData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);

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
      refetchOnWindowChange: true,
    }
  );
  //  Get sequence number-----------------------------
  const { data: maxSequenceData, refetch } = useQuery(
    "getSubCategoryMaxSequence",
    getSubCategoryMaxSequence,
    {
      //onSuccess: onSuccess,
      onError: onError,
      refetchOnWindowChange: true,
    }
  );

  const updateInitialValue = async (subCategoryData) => {
    initialFormData.id = subCategoryData.id ? subCategoryData.id : "";
    initialFormData.category_id = subCategoryData.category_id
      ? subCategoryData.category_id
      : "";
    initialFormData.name = subCategoryData.name ? subCategoryData.name : "";
    initialFormData.status = subCategoryData.status
      ? subCategoryData.status
      : 0;
    initialFormData.show_home = subCategoryData.show_home
      ? subCategoryData.show_home
      : 0;
    initialFormData.sequence = subCategoryData.sequence
      ? subCategoryData.sequence
      : 1;
    await setAllData({ ...allData, ...initialFormData });
  };

  useEffect(() => {
    // set data for edit ---------------------
    if (Object.keys(subCategoryData).length > 0) {
      updateInitialValue(subCategoryData);
    } else {
      // For create ----
      const subCategoryData = {};
      subCategoryData.status = 1;
      subCategoryData.sequence = maxSequenceData?.data?.result?.sequence;
      updateInitialValue(subCategoryData);
    }
  }, [subCategoryData]);

  const handleChange = async (e) => {
    if (e) {
      // on user change -----
      setAllData({ ...allData, [e.target.name]: e.target.value });
    }
  };

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "createSubCategoryRequest",
    createSubCategoryRequest,
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
    formData.append("category_id", allData.category_id);
    formData.append("name", allData.name);
    formData.append("show_home", allData.show_home);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);
    // Edit ----------------------------
    if (allData.id) {
      formData.append("_method", "PUT");
      const response = await updateSubCategoryRequest(formData, allData.id);
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
                                Sub Category Name
                              </label>
                              <div className="col-sm-9">
                                <input
                                  name="name"
                                  type="text"
                                  value={allData.name}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder="Type Sub Category name"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label"></label>

                              <div className="col-sm-3">
                                <select
                                  name="category_id"
                                  onChange={handleChange}
                                  value={allData.category_id}
                                  className="form-control"
                                  required
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
                                <label className=" col-form-label">
                                  Category
                                </label>
                              </div>
                              <div className="col-sm-3">
                                <select
                                  name="status"
                                  onChange={handleChange}
                                  value={allData.status}
                                  className="form-control"
                                  required
                                >
                                  <option value="">Select One </option>

                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </select>
                                <label className=" col-form-label">
                                  Status
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
                                  required
                                />
                                <label className=" col-form-label">
                                  Sequence
                                </label>
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
