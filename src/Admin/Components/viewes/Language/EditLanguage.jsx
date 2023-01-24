import { useState, useEffect } from "react";
import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useLanguageApi from "./useLanguageApi";
import defaultImage from "../../../assets/image/default_image.jpg";
import Loading from "../../ui-component/Loading";

import { Link, useParams } from "react-router-dom";
export default function EditLanguage() {
  const initialFormData = {
    id: null,
    name: "",
    status: 1,
    sequence: 0,
    _method: "PUT",
  };
  const { languageId } = useParams();
  const { onError, onSuccess } = useToster();
  const { showLanguageRequest, updateLanguageRequest } = useLanguageApi();
  const [allData, setAllData] = useState(initialFormData);
  const [filePreview, setFilePreview] = useState(defaultImage);
  const [photo, setPhoto] = useState(null);

  // get & set Language data ----------
  const { data, isLoading } = useQuery(
    ["showLanguageRequest", parseInt(languageId)],
    showLanguageRequest,
    {
      //onSuccess: onSuccess,
      onError: onError,
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const updateInitialValue = async (Language) => {
    initialFormData.id = Language.id;
    initialFormData.name = Language.name ? Language.name : "";
    initialFormData.status = Language.status ? Language.status : "";
    initialFormData.sequence = Language.sequence ? Language.sequence : "";
    await setFilePreview(Language.photo ? Language.photo : defaultImage);
    await setAllData(initialFormData);
  };
  useEffect(() => {
    let Language = [];
    if (!isLoading) {
      Language = data.data.result;
      updateInitialValue(Language);
    }
  }, [isLoading]);

  // on field value change -----
  const handleChange = (e) => {
    // on user change -----
    setAllData({ ...allData, [e.target.name]: e.target.value });
  };

  // on Image change -----
  function handelImage(e) {
    setPhoto(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  // Form Submit Handle --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("id", allData.id);
    formData.append("name", allData.name);
    formData.append("show_home", allData.show_home);
    formData.append("status", allData.status);
    formData.append("sequence", allData.sequence);
    formData.append("_method", "PUT");

    const response = await updateLanguageRequest(formData, languageId);
    if (response.status === 200) {
      await onSuccess(response);
    } else {
      await onError(response);
    }

    //return navigate("/admin/languages/list", { replace: true });
  };

  return (
    <>
      <PageHeader pageTitle={"Edit Language"} actionPage={"Language"} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5> Edit Language Info Here </h5>

                  <span></span>
                  <div className="card-header-right">
                    <Link to="/admin/languages/list" title="Language list">
                      Language List <i className="icofont icofont-list"></i>
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
