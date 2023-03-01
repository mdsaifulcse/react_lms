import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import styles from "./Style/ItemRental.module.css";
import { useQuery, useMutation } from "react-query";
import useItemRentalApi from "./useItemRentalApi";
import Loading from "../../ui-component/Loading";
import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowItemOrderModal from "./ShowItemRentalModal";

export default function ItemRentalList() {
  // Get Query Parma ---------------------
  const orderStatus = new URLSearchParams(useLocation().search).get(
    "orderStatus"
  );

  const { onError, onSuccess } = useToster();
  const { allItemRentalsRequest, deleteItemRentalRequest } = useItemRentalApi();
  const [itemsOrder, setItemsOrder] = useState({});
  const [modalShow, setModalShow] = useState(false);

  const {
    data: itemRentals,
    isLoading,
    refetch,
  } = useQuery(["allItemRentalsRequest", orderStatus], allItemRentalsRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: true,
  });

  async function handleRefetchAllData() {
    refetch();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteItemRentalRequest",
    deleteItemRentalRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (itemsRentalId, name) => {
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
        await mutateAsync(itemsRentalId);
        await refetch();
      } else {
        console.log("delete error");
      }
    });
  };

  let data = [];
  if (!isLoading) {
    data = itemRentals.data.result.itemRentals;
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "rental_no", //simple recommended way to define a column
        header: <span className="table-header">Rental No.</span>,
        size: 150,
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorFn: (row) =>
          row.user ? (
            <>
              <span>{row.user.name}</span>
            </>
          ) : (
            <>
              <span>N/A</span>
            </>
          ),
        id: "user", //id required if you use accessorFn instead of accessorKey
        header: "User",
        header: <span className="table-header">User</span>,
      },
      {
        accessorKey: "qty", //simple recommended way to define a column
        header: <span className="table-header">Qty</span>,
        size: 150,
        // muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorFn: (row) => {
          let date = new Date(row.rental_date);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var fullDate = date.getDate();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? "pm" : "am";
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? "0" + minutes : minutes;
          var strTime = hours + ":" + minutes + " " + ampm;
          return [year + "-" + month + "-" + fullDate + " " + strTime];
        }, //alternate way
        id: "rental_date", //id required if you use accessorFn instead of accessorKey
        header: "Rental Date",
        Header: <span className="table-header">Rental Date</span>, //optional custom markup
      },

      {
        accessorFn: (row) => {
          if (row.status === 0) {
            return (
              <>
                <span className="btn btn-warning btn-sm">Rental</span>
              </>
            );
          } else if (row.payment_status === 1) {
            return (
              <>
                <span className="btn btn-success btn-sm">Return</span>
              </>
            );
          } else if (row.payment_status === 2) {
            return (
              <>
                <span className="btn btn-danger btn-sm">Overdue</span>
              </>
            );
          }
        },
        //alternate way
        id: "status", //id required if you use accessorFn instead of accessorKey
        header: "Status",
        Header: <span className="table-header">Payment Status</span>, //optional custom markup
      },
    ],
    []
  );

  const showModalHandler = async (item) => {
    await setItemsOrder(item);
    await setModalShow(true);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Items Orders"} actionPage={"Items Orders"} />
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All Items Orders List</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link
                      to="/admin/item-rental/create"
                      title="To Create New Items Rental"
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
                        action
                        enableRowNumbers
                        enablePagination="true"
                        positionActionsColumn="last"
                        displayColumnDefOptions={{
                          "mrt-row-actions": {
                            header: "Action", //change header text
                            size: 200, //make actions column wider
                          },
                        }}
                        renderRowActions={(row, index) => (
                          <>
                            <button
                              title="Show Detials"
                              onClick={(e) => {
                                e.preventDefault();
                                let itemsRental = row.row.original;
                                showModalHandler(itemsRental);
                              }}
                              className={`btn  btn-info btn-sm ${styles.actionBtn}`}
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              title="Edit Items Rental"
                              to={`/admin/item-rental/edit/${row.row.original.id}`}
                              className={`btn  btn-warning btn-sm ${styles.actionBtn}`}
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let itemsRental = row.row.original;
                                deleteHandler(
                                  itemsRental.id,
                                  itemsRental.rental_no
                                );
                              }}
                              className={`btn  btn-danger btn-sm ${styles.actionBtn}`}
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
          <ShowItemOrderModal
            data={itemsOrder}
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalTitle="Items Rental Details"
            cardHeader="Items Rental Info"
          />
        </>
      )}
    </>
  );
}
