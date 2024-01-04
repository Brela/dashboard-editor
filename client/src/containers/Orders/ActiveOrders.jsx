import React, { useContext, useState } from "react";
import { OrdersContext } from "../../contexts/orders.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSort,
  faSortDown,
  faSortUp,
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import EditPopup from "./EditPopup";
import { useTable, useSortBy, usePagination } from "react-table";
import PaginationWrapper from "../../pages/InventoryCopilot/PaginationWrapper";
import AddProductButtons from "../Inventory/modals/AddProductButtons";
import { columnNameColor } from "../../css/globalTailwindVars";
import DemoControls from "../DemoControls";
import { Toolbar, ToolbarButton } from "../../components";

function ActiveOrders() {
  const { orders, activeOrders, reloadOrders, deliveriesOn } =
    useContext(OrdersContext);

  /* useEffect(() => {
        console.log(activeOrders)
    }, [activeOrders]);

    useEffect(() => {
        console.log(deliveriesOn)
    }, [deliveriesOn]);

    const simulateDelivery = async (order) => {
        const deliveryTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

        setTimeout(async () => {
            // Update the tempStockamount for this product
            console.log(order.shcedArrivalDate)
            console.log('sim prod delivered')

            // Send an update request to the backend to change the order status
            // await updateOrderStatusInBackend(order.id, "delivered");

            // Update the "in stock" amount for the inventory item in the React context
            // updateInventoryStock(order.inventoryItemId, order.quantity);

            // Send an update request to the backend to update the inventory
            // await updateInventoryStockInBackend(order.inventoryItemId, order.quantity);
        }, deliveryTime);
    };

    useEffect(() => {
        if (deliveriesOn) {
            activeOrders.forEach(order => {
                simulateDelivery(order);
            });
        }
    }, [activeOrders, deliveriesOn]);
 */

  // ---------- handle popup --------------------------

  const [orderForPopup, setOrderForPopup] = useState(null);

  const handleOpenPopup = (order) => {
    setOrderForPopup(order);
  };

  const handleClosePopup = () => {
    setOrderForPopup(null);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
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
        Header: "Arrival",
        accessor: (row) => row.schedArrivalDate || "n/a",
      },
      {
        Header: "QTY",
        accessor: "orderQty",
      },
      {
        Header: "Shipper",
        accessor: (row) => row.product.shipper,
      },
      {
        Header: "Total",
        accessor: (row) => `$${row.totalCost}`,
      },
      {
        Header: "Edit",
        id: "edit",
        Cell: ({ row }) => (
          <button id="settings" onClick={() => handleOpenPopup(row.original)}>
            <FontAwesomeIcon
              icon={faEdit}
              className="text-zinc-500 text-base"
              style={{ pointerEvents: "none" }}
            />
          </button>
        ),
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
    {
      columns,
      data: activeOrders,
      initialState: { pageIndex: 0, pageSize: 30 },
    },
    useSortBy,
    usePagination,
  );

  return (
    <>
      <div className="">
        <Toolbar>
          {/* bulk actions button */}
          {/* {selectedFlatRows.length > 0 && ( */}
          <button className="invisible" />
          <DemoControls page={"orders"} />
          {/* this comp used as hidden just to take up space like other tables have */}
          <div className="invisible">
            <AddProductButtons />
          </div>
        </Toolbar>

        <section className="overflow-x-auto h-[65vh] px-2">
          <table
            {...getTableProps()}
            className="table-auto w-full  text-black/80 "
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  {...headerGroup.getHeaderGroupProps()}
                  className="h-14 text-sm font-semibold border-b border-zinc-200"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className=" px-5 text-left font-semibold  whitespace-nowrap"
                      style={{
                        color: columnNameColor,
                      }}
                    >
                      {column.render("Header")}
                      <span className="">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FontAwesomeIcon
                              icon={faSortDown}
                              className="text-zinc-300/90 ml-2"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faSortUp}
                              className="text-zinc-300/90 ml-2"
                            />
                          )
                        ) : (
                          <FontAwesomeIcon
                            icon={faSort}
                            className="text-zinc-300/90 ml-2"
                          />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="text-sm ">
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    className="h-12 border-b last:border-none border-zinc-200 hover:bg-zinc-50"
                  >
                    {row.cells.map((cell) => (
                      <td
                        key={cell.id}
                        {...cell.getCellProps()}
                        className="px-6"
                      >
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
          <div className="flex justify-between p-2">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {
                  <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    className="text-lg text-zinc-400/80 hover:text-zinc-400/60 cursor-pointer"
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
                    className="text-lg text-zinc-400/80 hover:text-zinc-400/60 cursor-pointer"
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

      {orderForPopup && (
        <EditPopup handleClosePopup={handleClosePopup} order={orderForPopup} />
      )}
    </>
  );
}

export default ActiveOrders;
