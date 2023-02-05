import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useVendorApi from "./useVendorApi";
import Loading from "../../ui-component/Loading";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowVendorModal from "./ShowVendorModal";
import CreateEditModal from "./CreateEditModal";

export default function VendorList() {
  const { onError, onSuccess } = useToster();
  const { allVendorsRequest, deleteVendorRequest } = useVendorApi();
  const [vendor, setVendor] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [createEditModalTitle, setCreateEditModalTitle] = useState("");

  // Get All list Data ---------
  const {
    data: listdatas,
    isLoading,
    isError,
    refetch: loadListData,
  } = useQuery("allVendorsRequest", allVendorsRequest, {
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
    "deleteVendorRequest",
    deleteVendorRequest,
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
  if (!isLoading && !isError) {
    data = listdatas.data.result.vendors;
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
        accessorKey: "email", //simple recommended way to define a column
        header: "Email",
      },

      {
        accessorKey: "mobile", //simple recommended way to define a column
        header: "Mobile",
      },
      {
        accessorKey: "contact_person", //simple recommended way to define a column
        header: "Contact Person",
      },
      {
        accessorKey: "contact_person_mobile", //simple recommended way to define a column
        header: "Contact Person Mobile",
      },
      {
        accessorKey: "office_address", //simple recommended way to define a column
        header: "Office Address",
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
  const showModalHandler = async (vendor) => {
    await setVendor(vendor);
    await setModalShow(true);
  };
  // Create and Edit modal --------
  const createEditModalHandler = async (vendor, modalTitle) => {
    await setVendor(vendor);
    await setCreateEditModal(true);
    await setCreateEditModalTitle(modalTitle);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Vendor"} actionPage={"Vendor"} />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All vendor List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link
                      //to="/admin/categories/create"
                      title="To Create New Vendor"
                      onClick={(e) => {
                        e.preventDefault();
                        let vendor = {};
                        createEditModalHandler(vendor, "Create New Vendor");
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
                                let vendor = row.row.original;
                                showModalHandler(vendor);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                let vendor = row.row.original;
                                createEditModalHandler(
                                  vendor,
                                  "Edit Vendor Info"
                                );
                              }}
                              title="Edit Vendor"
                              className="btn btn-warning btn-sm"
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let vendor = row.row.original;
                                deleteHandler(vendor.id, vendor.name);
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
          <ShowVendorModal
            data={vendor} // it has come form state ----
            show={modalShow}
            onHide={() => setModalShow(false)}
            headTitle={"Vendor Details"}
            cardHeader="Vendor Info"
          />
          <CreateEditModal
            data={vendor} // it has come form state ----
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
