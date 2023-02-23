import PageHeader from "../../shared/PageHeader";
import useToster from "../../../hooks/useToster";
import { useQuery, useMutation } from "react-query";
import useItemApi from "./useItemApi";
import Loading from "../../ui-component/Loading";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialReactTable from "material-react-table";
import ShowItemModal from "./ShowItemModal";

export default function ItemsInventoryStock() {
  const { onError, onSuccess } = useToster();
  const { itemsInventoryStockRequest } = useItemApi();
  const [item, setItem] = useState({});
  const [modalShow, setModalShow] = useState(false);

  const {
    data: items,
    isLoading,
    refetch,
  } = useQuery("itemsInventoryStockRequest", itemsInventoryStockRequest, {
    //onSuccess: onSuccess,
    onError: onError,
    refetchOnWindowFocus: false,
  });

  async function handleRefetchAllData() {
    refetch();
  }

  let data = [];
  if (!isLoading) {
    data = items.data.result.items;
    console.log(items.data.result.items);
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "title", //simple recommended way to define a column
        header: <span className="table-header">Title</span>,
        //muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
        //Cell: ({ cell }) => <strong>{cell.getValue()}</strong>, //optional custom cell render
      },
      {
        accessorKey: "itemQty.qty", //simple recommended way to define a column
        header: <span className="table-header btn">Item Qty</span>,
      },
      {
        accessorKey: "isbn", //simple recommended way to define a column
        header: <span className="table-header">ISBN</span>,
      },
      {
        accessorFn: (row) => row.edition, //alternate way
        id: "edition", //id required if you use accessorFn instead of accessorKey
        header: "Edition",
        Header: <span className="table-header">Edition</span>, //optional custom markup
      },
      {
        accessorKey: "language", //simple recommended way to define a column
        header: <span className="table-header">Language</span>,
        // muiTableHeadCellProps: { sx: { color: "red" } }, //custom props
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

  const showModalHandler = async (item) => {
    await setItem(item);
    await setModalShow(true);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageTitle={"Inventory Stock"} actionPage={"Item Stock"} />
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>Item & Stock</h5>
                  <span></span>
                  <div className="card-header-right">
                    <i
                      onClick={handleRefetchAllData}
                      className="icofont icofont-refresh"
                    ></i>
                    <Link to="/admin/items/create" title="To Create New Item">
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
                                let item = row.row.original;
                                showModalHandler(item);
                              }}
                              className="btn  btn-info btn-sm"
                            >
                              <i className="icofont icofont-eye"></i>
                            </button>{" "}
                          </>
                        )}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ShowItemModal
            data={item}
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalTitle="Item Details"
            cardHeader="Item Info"
          />
        </>
      )}
    </>
  );
}
