import React, { useContext } from "react";
import { OrdersContext } from "../../contexts/orders.context";
import { clearAllOrderHistory } from "../../services/ordersAPIcalls";
import { useTable, useSortBy, usePagination } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSort,
  faSortUp,
  faSortDown,
  faCircleChevronRight,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import PaginationWrapper from "../../pages/Home/PaginationWrapper";
import { twMerge } from "tailwind-merge";

function OrderHistory() {
  const { orders, reloadOrders } = useContext(OrdersContext);

  const handleClearHistory = async () => {
    try {
      const response = await clearAllOrderHistory();
      console.log("History cleared:", response);
      reloadOrders();
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ value }) => <>{value}</>,
      },
      {
        Header: "SKU",
        accessor: "SKU",
      },
      {
        Header: "Name",
        accessor: (row) => row.product.productName,
      },
      {
        Header: "Date",
        accessor: "orderedDate",
      },
      {
        Header: "Arrived",
        accessor: (row) => row.delivered || "n/a",
      },
      {
        Header: "QTY",
        accessor: "orderQty",
      },
      {
        Header: "Total",
        accessor: (row) => `$${row.totalCost}`,
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data: orders, initialState: { pageIndex: 0, pageSize: 30 } },
    useSortBy,
    usePagination,
  );

  return (
    <div className="px-4">
      <div className="flex justify-end">
        <button
          className="bg-zinc-200 hover:bg-zinc-300/80 py-2 px-4 rounded-full text-zinc-700 font-semibold text-sm flex items-center gap-2"
          onClick={handleClearHistory}
        >
          <FontAwesomeIcon
            icon={faTrash}
            className=" text-zinc-500 text-base"
          />{" "}
          Clear History
        </button>
      </div>

      <section className="overflow-x-auto h-[65vh]">
        <table {...getTableProps()} className="w-full table-auto text-black/80">
          <thead className="border-b border-zinc-200 text-sm font-semibold">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="h-14 ">
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={twMerge(
                      "px-5 pl-10 text-left font-semibold",
                      // index === 0 ? "pl-10" : "",
                    )}
                  >
                    {column.render("Header")}
                    <span className="">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FontAwesomeIcon
                            icon={faSortDown}
                            className="text-zinc-400 ml-2"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faSortUp}
                            className="text-zinc-400 ml-2"
                          />
                        )
                      ) : (
                        <FontAwesomeIcon
                          icon={faSort}
                          className="text-zinc-400 ml-2"
                        />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="order-history-body text-sm"
          >
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="h-12 border-b last:border-none border-zinc-200 hover:bg-zinc-50"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-10">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <PaginationWrapper>
        <div className="flex gap-4 justify-between p-2 mt-6">
          <div className="flex gap-4 items-center">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="text-xl text-zinc-400 hover:text-zinc-400/80"
                />
              }
            </button>{" "}
            <span className="text-sm text-zinc-700">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {
                <FontAwesomeIcon
                  icon={faCircleChevronRight}
                  className="text-xl text-zinc-400 hover:text-zinc-400/80"
                />
              }
            </button>{" "}
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="rounded-xl bg-zinc-100 text-zinc-800 text-sm outline-none p-1"
          >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </PaginationWrapper>
    </div>
  );
}

export default OrderHistory;
