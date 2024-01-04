import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  disableSortBy,
} from "react-table";
import { InventoryContext } from "../../contexts/inventory.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faBox,
  faCartShopping,
  faCheck,
  faCircleChevronLeft,
  faCircleChevronRight,
  faGear,
  faShoppingCart,
  faSort,
  faSortDown,
  faSortUp,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import Order from "./modals/OrderNow";
import { createOrderItem } from "../../services/ordersAPIcalls";
import { useAutomaticOrders } from "../../hooks/useAutomaticOrders";
import { OrdersContext } from "../../contexts/orders.context";
import AddProductButtons from "./modals/AddProductButtons";
import OrderHistory from "../Orders/OrderHistory";
import ActiveOrders from "../Orders/ActiveOrders";
import SelectedRowsModal from "./modals/BulkActions";
import {
  getInventoryList,
  updateInventoryItem,
} from "../../services/inventoryAPIcalls";
import { EditableCell } from "./EditableCell";
import DemoControls from "../DemoControls";
import PaginationWrapper from "../../pages/InventoryCopilot/PaginationWrapper";
import { useQuery } from "react-query";
import { columnNameColor, primaryColor } from "../../css/globalTailwindVars";
import { Toolbar, ToolbarButton } from "../../components";

export default function Inventory() {
  const {
    inventory,
    reloadInventory,
    isUsingStock,
    tempInStock,
    setTempInStock,
    selectedItems,
    setSelectedItems,
    toggleSelectedItem,
    isLoading,
  } = useContext(InventoryContext);

  /*  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery(
    "inventory",
    getInventoryList,
    { retries: 2 },
  );
  const inventory = inventoryData ? inventoryData.items : []; */

  const {
    activeOrders,
    reloadOrders,
    setDisplayOrderedDeliveredPopup,
    setOrderedDeliveryPopupContent,
  } = useContext(OrdersContext);

  const [popup, setPopup] = useState(null);
  const [activeTab, setActiveTab] = useState("inventory");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  const handleShowPopup = (product) => {
    setProductForPopup(product);
    setPopup("order");
  };
  const [productForPopup, setProductForPopup] = useState("");

  const handleClosePopup = () => {
    setPopup(null);
    setProductForPopup(null);
  };

  const openModalWithSelectedRows = () => {
    setModalData(selectedRowsData);
    setIsModalOpen(true);
  };

  const handleReloadInventory = () => {
    reloadInventory();
  };

  useAutomaticOrders(
    inventory,
    isUsingStock,
    tempInStock,
    createOrderItem,
    reloadOrders,
    selectedItems,
    setOrderedDeliveryPopupContent,
    setDisplayOrderedDeliveredPopup,
  );

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    },
  );

  const data = useMemo(
    () => (Array.isArray(inventory) ? inventory : []),
    [inventory],
  );

  const columns = useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ value }) => <span className="">{value}</span>,
      },
      {
        Header: "Brand",
        accessor: "brand",
        Cell: ({ value }) => <span className="">{value}</span>,
      },
      {
        Header: "Name",
        accessor: "productName",
        Cell: ({ value }) => <span className="">{value}</span>,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <span className="">{value}</span>,
      },
      {
        Header: "Unit Price",
        accessor: "unitPrice",
        Cell: ({ value }) => (
          <span>
            {parseFloat(value).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
      },
      {
        Header: "In Stock",
        accessor: "inStock",
        Cell: ({ value, row }) => {
          const item = row.original;
          return (
            <span className="">{tempInStock[item.id] || item.inStock}</span>
          );
        },
      },
      {
        Header: "Reorder At",
        accessor: "reorderAt",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            accessor="reorderAt"
            updateFunction={updateInventoryItem}
            reloadFunction={reloadInventory}
          />
        ),
      },
      {
        Header: "Order Qty",
        accessor: "orderQty",
        Cell: ({ value, row }) => (
          <EditableCell
            value={value}
            row={row}
            accessor="orderQty"
            updateFunction={updateInventoryItem}
            reloadFunction={reloadInventory}
          />
        ),
      },
      {
        Header: "Order",
        accessor: "order",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button onClick={() => handleShowPopup(row.original)} className="">
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-zinc-500/70 text-lg"
            />
          </button>
        ),
      },
    ],
    [tempInStock],
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
    selectedFlatRows,
    toggleRowSelected,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 30 },
      disableSortBy,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div className="pl-4">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div className="pl-4">
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  const selectedRowsData = React.useMemo(() => {
    return selectedFlatRows.map((row) => row.original);
  }, [selectedFlatRows]);

  // Define a ref to store the previous value of selectedItems
  const previousSelectedRef = useRef();

  // Initialize previousSelectedRef on component mount
  useEffect(() => {
    previousSelectedRef.current = selectedItems;
  }, []);

  // This effect syncs the local storage `selectedItems` with the table's state
  useEffect(() => {
    if (previousSelectedRef.current) {
      // Deselect all rows first
      Object.keys(selectedRowIds).forEach((id) => {
        toggleRowSelected(id, false);
      });

      // Now, select rows that should be selected
      selectedItems.forEach((item) => {
        const rowId = data.findIndex((dataItem) => dataItem.id === item.id);
        if (rowId >= 0) {
          toggleRowSelected(rowId, true);
        }
      });
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <SelectedRowsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedRows={selectedRowsData}
          />

          <Toolbar>
            {/* bulk actions button */}
            {/* {selectedFlatRows.length > 0 && ( */}
            <ToolbarButton
              text="Bulk Actions"
              onClick={openModalWithSelectedRows}
              icon={faGear}
            />

            {/* )} */}
            <DemoControls page={"inventory"} />
            <AddProductButtons />
          </Toolbar>

          <section className="overflow-x-auto h-[65vh] z-0 ">
            <table
              {...getTableProps()}
              id="inventory"
              className="w-full table-auto text-black/80 mt-2 z-0"
            >
              <thead className="border-b h-8 text-sm z-0">
                {headerGroups.map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    {...headerGroup.getHeaderGroupProps()}
                    className="relative z-10 "
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        key={column.id}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps(),
                        )}
                        className=" px-5 text-left font-semibold whitespace-nowrap"
                        style={{
                          color: columnNameColor,
                        }}
                      >
                        {column.render("Header")}
                        <span className="">
                          {column.id !== "selection" &&
                          column.id !== "order" ? (
                            column.isSorted ? (
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
                            )
                          ) : null}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="tracking-wide">
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id}
                      className="text-sm h-16 border-b last:border-none border-zinc-200 hover:bg-zinc-50"
                    >
                      {row.cells.map((cell, idx) => (
                        <td {...cell.getCellProps()} key={idx} className="px-5">
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
            <div className="flex gap-4 justify-between p-2">
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
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
                className="rounded-lg bg-zinc-100 text-zinc-800 text-sm outline-none p-1"
              >
                {[10, 20, 30, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </PaginationWrapper>
        </>
      )}

      {popup === "order" && (
        <Order
          handleClosePopup={handleClosePopup}
          popup={popup}
          item={productForPopup}
          reloadOrders={reloadOrders}
          handleReloadInventory={handleReloadInventory}
        />
      )}
    </div>
  );
}
