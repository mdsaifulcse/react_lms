import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useSubCategoryApi from "./useSubCategoryApi";
import Loading from "../../ui-component/Loading";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowSubCategoryModal from "./ShowSubCategoryModal";
import CreateEditModal from "./CreateEditModal";

export default function SubCategoryList() {
  const { onError, onSuccess } = useToster();
  const { allSubCategoriesRequest, deleteSubCategoryRequest } =
    useSubCategoryApi();
  const [subCategory, setSubCategory] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [createEditModalTitle, setCreateEditModalTitle] = useState("");

  // Get All list Data ---------
  const {
    data: listdatas,
    isLoading,
    refetch: loadListData,
    isError,
    error,
  } = useQuery("allSubCategoriesRequest", allSubCategoriesRequest, {
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
    "deleteSubCategoryRequest",
    deleteSubCategoryRequest,
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

  let listData = [];

  if (!isLoading) {
    if (isError) {
      onError(error);
    } else {
      listData = listdatas.data.result.subCategories;
    }
  }

  // Datatable columns ------
  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Sub Category",
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorKey: "category_name", //simple recommended way to define a column
        header: "Category",
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
  const showModalHandler = async (subcategory) => {
    await setSubCategory(subcategory);
    await setModalShow(true);
  };
  // Create and Edit modal --------
  const createEditModalHandler = async (subcategory, modalTitle) => {
    await setSubCategory(subcategory);
    await setCreateEditModal(true);
    await setCreateEditModalTitle(modalTitle);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Sub Category"} actionPage={"Sub Category"} />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All Sub Category List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link
                      //to="/admin/sub-categories/create"
                      title="To Create New Sub Category"
                      onClick={(e) => {
                        e.preventDefault();
                        let subCategory = {};
                        createEditModalHandler(
                          subCategory,
                          "Create New Sub Category"
                        );
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
                        data={listData} // this list data come form api
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
                                let subCategory = row.row.original;
                                showModalHandler(subCategory);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                let subCategory = row.row.original;
                                createEditModalHandler(
                                  subCategory,
                                  "Edit Sub Category Info"
                                );
                              }}
                              title="Edit Sub Category"
                              className="btn btn-warning btn-sm"
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let subCategory = row.row.original;
                                deleteHandler(subCategory.id, subCategory.name);
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
          <ShowSubCategoryModal
            data={subCategory} // it has come form state ----
            show={modalShow}
            onHide={() => setModalShow(false)}
            headTitle={"Sub Category Details"}
          />
          <CreateEditModal
            data={subCategory} // it has come form state ----
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
