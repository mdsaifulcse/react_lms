import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemReceivedApi from "./useItemReceivedApi";
import Loading from "../../ui-component/Loading";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowItemReceivedModal from "./ShowItemReceivedModal";

export default function ItemReceivedList() {
  const { onError, onSuccess } = useToster();
  const { allItemsReceivedsRequest, deleteItemReceivedRequest } =
    useItemReceivedApi();
  const [modalData, setModalData] = useState({});
  const [modalShow, setModalShow] = useState(false);

  const {
    data: itemsReceived,
    isLoading,
    isError,
    refetch,
  } = useQuery("allItemsReceivedsRequest", allItemsReceivedsRequest, {
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
    "deleteItemReceivedRequest",
    deleteItemReceivedRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (itemsOrderId, name) => {
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
        await mutateAsync(itemsOrderId);
        await refetch();
      } else {
        console.log("delete error");
      }
    });
  };

  let data = [];
  if (!isLoading && !isError) {
    data = itemsReceived.data.result.receivedItems;
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "receive_no", //simple recommended way to define a column
        header: <span className="table-header">Received No.</span>,
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
        accessorFn: (row) => row.payable_amount, //alternate way
        id: "payable_amount", //id required if you use accessorFn instead of accessorKey
        header: "Amount",
        Header: <span className="table-header">Amount</span>, //optional custom markup
      },
      {
        accessorKey: "received_date", //simple recommended way to define a column
        header: <span className="table-header">Received</span>,
      },
      {
        accessorKey: "vendor_name", //simple recommended way to define a column
        header: <span className="table-header">Vendor Name</span>,
      },
      {
        accessorFn: (row) => {
          if (row.payment_status === 1) {
            return (
              <>
                <span className="btn btn-success btn-sm">Paid</span>
              </>
            );
          } else if (row.payment_status === 2) {
            return (
              <>
                <Link
                  to={`/admin/item-received/create/`}
                  title="Click Here To Make Vendor Payment"
                  className={`btn  btn-danger btn-sm`}
                  target="_blank"
                >
                  <span>Unpaind</span>
                </Link>
              </>
            );
          } else if (row.payment_status === 3) {
            return (
              <>
                <Link
                  to={`/admin/item-received/create/`}
                  title="Click Here To Make Vendor Payment"
                  className={`btn  btn-warning btn-sm`}
                  target="_blank"
                >
                  <span>Due</span>
                </Link>
              </>
            );
          }
        },
        //alternate way
        id: "payment_status", //id required if you use accessorFn instead of accessorKey
        header: "Payment Status",
        Header: <span className="table-header">Payment Status</span>, //optional custom markup
      },
    ],
    []
  );

  const showModalHandler = async (itemsReceived) => {
    await setModalData(itemsReceived);
    await setModalShow(true);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader
            pageTitle={"Items Received"}
            actionPage={"Items Received"}
          />
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>All Items Received List</h5>
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
                                let itemsReceived = row.row.original;
                                showModalHandler(itemsReceived);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                let data = row.row.original;
                                deleteHandler(data.id, data.receive_no);
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
          <ShowItemReceivedModal
            data={modalData}
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalTitle="Items Received Details"
            cardHeader="Items Received Info"
          />
        </>
      )}
    </>
  );
}
