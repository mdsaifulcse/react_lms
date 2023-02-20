import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemReceivedApi from "./useVendorPaymentApi";
import Loading from "../../ui-component/Loading";
import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowVendoerPaymentModal from "./ShowVendoerPaymentModal";

export default function VendorPaymentList() {
  const paymentStatus = new URLSearchParams(useLocation().search).get(
    "paymentStatus"
  );
  const { onError, onSuccess } = useToster();
  const { allVendorPaymentsRequest, deleteVendorPaymentRequest } =
    useItemReceivedApi();
  const [modalData, setModalData] = useState({});
  const [modalShow, setModalShow] = useState(false);

  const {
    data: itemsReceived,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["allVendorPaymentsRequest", paymentStatus],
    allVendorPaymentsRequest,
    {
      //onSuccess: onSuccess,
      onError: onError,
      refetchOnWindowFocus: false,
    }
  );

  async function handleRefetchAllData() {
    refetch();
  }

  // Delete confirmation then delete -----------------
  // Create Api MutateAsync --------------
  const { mutateAsync } = useMutation(
    "deleteVendorPaymentRequest",
    deleteVendorPaymentRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
  const deleteHandler = async (paymentId, name) => {
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
        await mutateAsync(paymentId);
        await refetch();
      } else {
        console.log("delete error");
      }
    });
  };

  let data = [];
  if (!isLoading && !isError) {
    data = itemsReceived.data.result.vendorPayments;
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "vendor_payment_no", //simple recommended way to define a column
        header: <span className="table-header">Payment No.</span>,
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },

      {
        accessorFn: (row) => row.paid_amount, //alternate way
        id: "paid_amount", //id required if you use accessorFn instead of accessorKey
        header: "Amount",
        Header: <span className="table-header">Amount</span>, //optional custom markup
        size: 50,
      },
      {
        accessorKey: "payment_date", //simple recommended way to define a column
        header: <span className="table-header">Payment</span>,
      },
      {
        accessorKey: "vendor_name", //simple recommended way to define a column
        header: <span className="table-header">Vendor</span>,
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
            pageTitle={"Vendoer Paymet list"}
            actionPage={"Payment list"}
          />
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5> Vendoer Payment List</h5>
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
                                deleteHandler(data.id, data.vendor_payment_no);
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
          <ShowVendoerPaymentModal
            data={modalData}
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalTitle="Vendor Payment Details"
            cardHeader="Payment Info"
          />
        </>
      )}
    </>
  );
}
