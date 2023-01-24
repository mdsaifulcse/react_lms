import { Fragment, useState, useEffect } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useLanguageApi from "./useLanguageApi";
import defaultImage from "../../../assets/image/default_image.jpg";

import { Link } from "react-router-dom";
export default function CreateLanguage() {
  const { onError, onSuccess } = useToster();
  const { getLanguageMaxSequence, createLanguageRequest } = useLanguageApi();
  const initialFormData = {
    name: "",
    status: 1,
    sequence: 0,
  };
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [photo, setPhoto] = useState(null);

  //  Get sequence number-----------------------------
  const { data: maxSequenceData, refetch } = useQuery(
    "getLanguageMaxSequence",
    getLanguageMaxSequence,
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
    setPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "createLanguageRequest",
    createLanguageRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("name", allData.name);
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
      <PageHeader pageTitle={"Create Language"} actionPage={" Language"} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5> Create New Language Here </h5>

              <span></span>
              <div className="card-header-right">
                {/* <i className="icofont icofont-refresh"></i> */}
                <Link to="/admin/languages/list" title="Publisher list">
                  Language List <i className="icofont icofont-list"></i>
                </Link>
              </div>
            </div>
            <div className="card-block">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        Language Name
                      </label>
                      <div className="col-sm-10">
                        <input
                          name="name"
                          value={allData.name}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                          placeholder="Type Language name"
                        />
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
