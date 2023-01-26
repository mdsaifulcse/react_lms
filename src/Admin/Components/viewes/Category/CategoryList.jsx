import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useCategoryApi from "./useCategoryApi";
import Loading from "../../ui-component/Loading";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowCategoryModal from "./ShowCategoryModal";
import CreateEditModal from "./CreateEditModal";

export default function CategoryList() {
  const { onError, onSuccess } = useToster();
  const { allCategoriesRequest, deleteCategoryRequest } = useCategoryApi();
  const [category, setCategory] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [createEditModalTitle, setCreateEditModalTitle] = useState("");

  // Get All list Data ---------
  const {
    data: listdatas,
    isLoading,
    refetch: loadListData,
  } = useQuery("allCategoriesRequest", allCategoriesRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  async function handleRefetchAllData() {
    loadListData();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteCategoryRequest",
    deleteCategoryRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (id, name) => {
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
        await mutateAsync(id);
        await loadListData();
      } else {
        //console.log("delete error");
      }
    });
  };

  let data = [];
  if (!isLoading) {
    data = listdatas.data.result.categories;
  }

  // Datatable columns ------
  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },

      {
        accessorFn: (row) =>
          row.status === 1 ? (
            <>
              <span className="badge badge-success">Active</span>
            </>
          ) : (
            <>
              <span className="badge badge-danger">Inactive</span>
            </>
          ), //alternate way
        id: "status", //id required if you use accessorFn instead of accessorKey
        header: "Status",
        Header: <span className="table-header">Status</span>, //optional custom markup
      },
    ],
    []
  );
  // Show Details modal --------
  const showModalHandler = async (category) => {
    await setCategory(category);
    await setModalShow(true);
  };
  // Create and Edit modal --------
  const createEditModalHandler = async (category, modalTitle) => {
    await setCategory(category);
    await setCreateEditModal(true);
    await setCreateEditModalTitle(modalTitle);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Category"} actionPage={"Category"} />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All Category List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link
                      //to="/admin/categories/create"
                      title="To Create New Category"
                      onClick={(e) => {
                        e.preventDefault();
                        let category = {};
                        createEditModalHandler(category, "Create New Category");
                      }}
                    >
                      New <i className="icofont icofont-plus"></i>
                    </Link>
                  </div>
                </div>
                <div className="card-block table-border-style">
                  <div className="table-responsive">
                    {
                      <MaterialReactTable
                        columns={columns}
                        data={data}
                        enableRowActions
                        enableColumnActions
                        enableRowNumbers
                        positionActionsColumn="last"
                        enablePagination="true"
                        renderRowActions={(row, index) => (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let category = row.row.original;
                                showModalHandler(category);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                let category = row.row.original;
                                createEditModalHandler(
                                  category,
                                  "Edit Category Info"
                                );
                              }}
                              title="Edit Category"
                              className="btn btn-warning btn-sm"
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let category = row.row.original;
                                deleteHandler(category.id, category.name);
                              }}
                              className="btn  btn-danger btn-sm"
                            >
                              <i className="icofont icofont-trash"></i>
                            </button>
                          </>
                        )}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ShowCategoryModal
            data={category} // it has come form state ----
            show={modalShow}
            onHide={() => setModalShow(false)}
            headTitle={"Category Details"}
          />
          <CreateEditModal
            data={category} // it has come form state ----
            show={createEditModal}
            onHide={() => setCreateEditModal(false)}
            headTitle={createEditModalTitle}
            loadListData={loadListData}
          />
        </>
      )}
    </>
  );
}
