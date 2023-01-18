import PageHeader from "../../Shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useAuthorApi from "./useAuthorApi";
import Loading from "../../Ui-Component/Loading";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";

export default function AllAuthorsList() {
  const { onError, onSuccess } = useToster();
  const { allAuthorsRequest, deleteAuthorsRequest } = useAuthorApi();
  //const [ authors, setAuthors ] = useState({});

  const {
    data: authors,
    isLoading,
    refetch,
  } = useQuery("AllAuthor", allAuthorsRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  async function handleRefetchAuthor() {
    refetch();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteAuthorsRequest",
    deleteAuthorsRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (authorId, name) => {
    Swal.fire({
      title: "Error!",
      text: `Do you want to delete ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await mutateAsync(authorId);
        await refetch();
      } else {
        console.log("123");
      }
    });
  };

  let data = [];
  if (!isLoading) {
    data = authors.data.result.authors;
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorKey: "email", //simple recommended way to define a column
        header: "Email",
        muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorFn: (row) => row.mobile, //alternate way
        id: "mobile", //id required if you use accessorFn instead of accessorKey
        header: "Mobile",
        Header: <i style={{ color: "red" }}>Mobile</i>, //optional custom markup
      },
    ],
    []
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Author"} actionPage={"Author"} />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All Author List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAuthor}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link to="/admin/authors/create" title="To Create Author">
                      <i className="icofont icofont-plus"></i>
                    </Link>
                  </div>
                </div>
                <div className="card-block table-border-style">
                  <div className="table-responsive">
                    {<MaterialReactTable columns={columns} data={data} />}
                    {/* <table className="table">
                      <thead>
                        <tr>
                          <th>SN.</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((author, i) => (
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{author.name}</td>
                            <td>{author.email ? author.email : "N/A"}</td>
                            <td>{author.mobile ? author.mobile : "N/A"}</td>
                            <td>
                              {author.status === 1 ? "Active" : "Inactive"}
                            </td>
                            <td>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteHandler(author.id, author.name);
                                }}
                                className="btn btn-sm btn-danger"
                              >
                                <i className="icofont icofont-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
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
