import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemOrderApi from "./useItemOrderApi";
import Loading from "../../ui-component/Loading";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowItemOrderModal from "./ShowItemOrderModal";

export default function ItemOrderList() {
  const { onError, onSuccess } = useToster();
  const { allItemsOrdersRequest, deleteItemOrderRequest } = useItemOrderApi();
  const [itemsOrder, setItemsOrder] = useState({});
  const [modalShow, setModalShow] = useState(false);

  const {
    data: itemsOrders,
    isLoading,
    refetch,
  } = useQuery("allItemsOrdersRequest", allItemsOrdersRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  async function handleRefetchAllData() {
    refetch();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteItemOrderRequest",
    deleteItemOrderRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (itemsOrderId, name) => {
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
        await mutateAsync(itemsOrderId);
        await refetch();
      } else {
        console.log("delete error");
      }
    });
  };

  let data = [];
  if (!isLoading) {
    data = itemsOrders.data.result.itemOrders;
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "order_no", //simple recommended way to define a column
        header: <span className="table-header">Order No.</span>,
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorKey: "qty", //simple recommended way to define a column
        header: <span className="table-header">Qty</span>,
        // muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorFn: (row) => row.amount, //alternate way
        id: "amount", //id required if you use accessorFn instead of accessorKey
        header: "Amount",
        Header: <span className="table-header">Amount</span>, //optional custom markup
      },
      {
        accessorKey: "tentative_date", //simple recommended way to define a column
        header: <span className="table-header">Tentative Date Receive</span>,
      },
      {
        accessorKey: "vendor_name", //simple recommended way to define a column
        header: <span className="table-header">Vendor Name</span>,
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
                      to="/admin/items-orders/create"
                      title="To Create New Items Order"
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
                                let itemsOrder = row.row.original;
                                showModalHandler(itemsOrder);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <Link
                              to={`/admin/items-orders/edit/${row.row.original.id}`}
                              title="Edit Items Order"
                              className="btn btn-warning btn-sm"
                            >
                              <i className="icofont icofont-edit"></i>
                            </Link>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let item = row.row.original;
                                deleteHandler(itemsOrder.id, itemsOrder.name);
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
          <ShowItemOrderModal
            data={itemsOrder}
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalTitle="Items Order Details"
            cardHeader="Items Order Info"
          />
        </>
      )}
    </>
  );
}
