import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useMembershipPlanApi from "./useMembershipPlanApi";
import Loading from "../../ui-component/Loading";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowModal from "./ShowModal";
import CreateEditModal from "./CreateEditModal";

export default function MembershipPlanist() {
  const { onError, onSuccess } = useToster();
  const { allMembershipPlansRequest, deleteMembershipPlanRequest } =
    useMembershipPlanApi();
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
  } = useQuery("allMembershipPlansRequest", allMembershipPlansRequest, {
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
    "deleteMembershipPlanRequest",
    deleteMembershipPlanRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (id, name) => {
    Swal.fire({
      title: "Warning!",
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
    data = listdatas.data.result.membershipPlans;
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
        accessorKey: "fee_amount", //simple recommended way to define a column
        header: "Fee Amount",
      },

      {
        accessorFn: (row) =>
          row.valid_duration === 0 ? (
            <>
              <span className="badge badge-success">Forever</span>
            </>
          ) : (
            <>
              <span className="badge badge-info">
                {row.valid_duration} Month
              </span>
            </>
          ), //simple recommended way to define a column
        id: "valid_duration",
        header: "Valid Duration",
      },
      {
        accessorKey: "sequence", //simple recommended way to define a column
        header: "Sequence",
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
                        displayColumnDefOptions={{
                          "mrt-row-actions": {
                            header: "Action", //change header text
                            size: 200, //make actions column wider
                          },
                        }}
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
          <ShowModal
            data={vendor} // it has come form state ----
            show={modalShow}
            onHide={() => setModalShow(false)}
            headTitle={"Membership Plan Details"}
            cardHeader="Membership Plan Info"
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
