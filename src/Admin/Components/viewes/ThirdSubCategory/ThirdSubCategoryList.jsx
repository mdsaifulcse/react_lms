import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useThirdSubCategoryApi from "./useThirdSubCategoryApi";
import Loading from "../../ui-component/Loading";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowThirdSubCategoryModal from "./ShowThirdSubCategoryModal";
import CreateEditModal from "./CreateEditModal";

export default function ThirdSubCategoryList() {
  const { onError, onSuccess } = useToster();
  const { allThirdSubCategoriesRequest, deleteThirdSubCategoryRequest } =
    useThirdSubCategoryApi();
  const [thirdSubCategory, setThirdSubCategory] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [createEditModalTitle, setCreateEditModalTitle] = useState("");

  // Get All list Data ---------
  const {
    data: listdatas,
    isLoading,
    refetch: loadListDataRefetch,
    isError,
    error,
  } = useQuery("allThirdSubCategoriesRequest", allThirdSubCategoriesRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  async function handleRefetchAllData() {
    loadListDataRefetch();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteThirdSubCategoryRequest",
    deleteThirdSubCategoryRequest,
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
        await loadListDataRefetch();
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
      listData = listdatas.data.result.thirdSubCategories;
    }
  }

  // Datatable columns ------
  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Third Sub Category",
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorKey: "sub_category_name", //simple recommended way to define a column
        header: "Sub Category",
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
  const showModalHandler = async (thirdSubcategory) => {
    await setThirdSubCategory(thirdSubcategory);
    await setModalShow(true);
  };
  // Create and Edit modal --------
  const createEditModalHandler = async (thirdSubcategory, modalTitle) => {
    await setThirdSubCategory(thirdSubcategory);
    await setCreateEditModal(true);
    await setCreateEditModalTitle(modalTitle);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader
            pageTitle={"Third Sub Category"}
            actionPage={"Third Sub Category"}
          />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All Third Sub Category List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link
                      //to="/admin/sub-categories/create"
                      title="To Create New Third Sub Category"
                      onClick={(e) => {
                        e.preventDefault();
                        let thirdSubcategory = {};
                        createEditModalHandler(
                          thirdSubcategory,
                          "Create New Third Sub Category"
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
                                let thirdSubcategory = row.row.original;
                                showModalHandler(thirdSubcategory);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                let thirdSubcategory = row.row.original;
                                createEditModalHandler(
                                  thirdSubcategory,
                                  "Edit Third Sub Category Info"
                                );
                              }}
                              title="Edit Third Sub Category"
                              className="btn btn-warning btn-sm"
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let thirdSubcategory = row.row.original;
                                deleteHandler(
                                  thirdSubcategory.id,
                                  thirdSubcategory.name
                                );
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
          <ShowThirdSubCategoryModal
            data={thirdSubCategory} // it has come form state ----
            show={modalShow}
            onHide={() => setModalShow(false)}
            headTitle={"Third Sub Category Details"}
          />
          <CreateEditModal
            data={thirdSubCategory} // it has come form state ----
            show={createEditModal}
            onHide={() => setCreateEditModal(false)}
            headTitle={createEditModalTitle}
            loadListData={loadListDataRefetch}
          />
        </>
      )}
    </>
  );
}
