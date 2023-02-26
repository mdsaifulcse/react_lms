import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useUserMembershipPlanApi from "./useUserMembershipPlanApi";
import Loading from "../../ui-component/Loading";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowModal from "./ShowModal";
import CreateEditModal from "./CreateEditModal";

export default function UserMembershipPlanList() {
  const { onError, onSuccess } = useToster();
  const {
    allGeneralUsersRequest,
    activeMembershipPlansRequest,
    allUserMembershipPlansRequest,
    deleteUserMembershipPlanRequest,
  } = useUserMembershipPlanApi();
  const [membershipPlan, setMembershipPlan] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [createEditModalTitle, setCreateEditModalTitle] = useState("");
  //  Dropdown Data --------
  const [activeGeneralUser, setActiveGeneralUser] = useState("");
  const [activePlan, setActivePlan] = useState("");

  // Get All list Data ---------
  const {
    data: listdatas,
    isLoading,
    isError,
    refetch: loadListData,
  } = useQuery("allUserMembershipPlansRequest", allUserMembershipPlansRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  // Get General User Data ---------
  const {
    generalUserIsLoading,
    generalUserIsError,
    refetch: generalUserRefetch,
  } = useQuery("allGeneralUsersRequest", allGeneralUsersRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        await setActiveGeneralUser(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowFocus: false,
  });
  // Get Active Plan Data ---------
  const {
    activePlanIsLoading,
    activePlanIsError,
    refetch: activePlanRefetch,
  } = useQuery("activeMembershipPlansRequest", activeMembershipPlansRequest, {
    onSuccess: async (response) => {
      if (response.status === 200) {
        console.log(response.data.result);
        await setActivePlan(response.data.result);
      }
    },
    onError: onError,
    refetchOnWindowFocus: false,
  });

  async function handleRefetchAllData() {
    loadListData();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteUserMembershipPlanRequest",
    deleteUserMembershipPlanRequest,
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
    data = listdatas.data.result.userPlans;
  }

  // Datatable columns ------
  const columns = useMemo(
    () => [
      {
        accessorKey: "user_name", //simple recommended way to define a column
        header: "User Name",
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorKey: "membership_plan", //simple recommended way to define a column
        header: "Plan Name",
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
  const showModalHandler = async (data) => {
    await setMembershipPlan(data);
    await setModalShow(true);
  };
  // Create and Edit modal --------
  const createEditModalHandler = async (data, modalTitle) => {
    await setMembershipPlan(data);
    await setCreateEditModal(true);
    await setCreateEditModalTitle(modalTitle);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"User Plan"} actionPage={"User Plan"} />

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All User Plan List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link
                      //to="/admin/categories/create"
                      title="To Create New Membership Plan"
                      onClick={(e) => {
                        e.preventDefault();
                        let data = {};
                        createEditModalHandler(
                          data,
                          "Create New Membership Plan"
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
                                let data = row.row.original;
                                showModalHandler(data);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                let data = row.row.original;
                                createEditModalHandler(
                                  data,
                                  "Edit Membership Plan Info"
                                );
                              }}
                              title="Edit Membership Plan"
                              className="btn btn-warning btn-sm"
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let data = row.row.original;
                                deleteHandler(data.id, data.name);
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
            data={membershipPlan} // it has come form state ----
            show={modalShow}
            onHide={() => setModalShow(false)}
            headTitle={"Membership Plan Details"}
            cardHeader="Membership Plan Info"
          />
          <CreateEditModal
            data={membershipPlan} // it has come form state ----
            show={createEditModal}
            onHide={() => setCreateEditModal(false)}
            headTitle={createEditModalTitle}
            loadListData={loadListData}
            activeGeneralUser={activeGeneralUser}
            activePlan={activePlan}
          />
        </>
      )}
    </>
  );
}
