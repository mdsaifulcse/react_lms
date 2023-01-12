import PageHeader from "../../Shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery } from "react-query";
import useAuthorApi from "./useAuthorApi";
import Loading from "../../Ui-Component/Loading";
import { useState } from "react";
export default function AllAuthorsList() {
  const { onError, onSuccess } = useToster();
  const { allAuthorsRequest } = useAuthorApi();
  const { authors, setAuthors } = useState({});

  const { data, isLoading } = useQuery("AllAuthor", allAuthorsRequest, {
    onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    <Loading />;
  }
  if (!isLoading) {
    //setAuthors("123");
    console.log(data.data.result);
  }

  return (
    <>
      <PageHeader pageTitle={"Author"} actionPage={"Author"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>All Author List</h5>
              <span></span>
              <div className="card-header-right">
                <i className="icofont icofont-refresh"></i>
              </div>
            </div>
            <div className="card-block table-border-style">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
