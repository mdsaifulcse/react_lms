export default function ItemList({ itemOrderAbleList, deleteItemFromList }) {
  return (
    <table className="table table-border">
      <thead>
        <tr>
          <th>SL</th>
          <th>Name</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Item Price</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {itemOrderAbleList.length > 0 ? (
          itemOrderAbleList.reverse().map((item, i) => (
            <tr key={i} id={i}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.itemQty}</td>
              <td>{item.itemPrice}</td>
              <td>{item.itemTotalPrice}</td>
              <td>
                {/* <button type="button" className="btn btn-sm btn-warning">
                  <i className="icofont icofont-edit"></i>
                </button>
                / */}
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteItemFromList(i);
                  }}
                >
                  <i className="icofont icofont-trash"></i>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
