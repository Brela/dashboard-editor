import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRotateLeft,
  faQuestionCircle,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { InventoryContext } from "../contexts/inventory.context";
import { OrdersContext } from "../contexts/orders.context";
import { Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";
import { headerBg } from "../css/globalTailwindVars";

export default function DemoControls({ page }) {
  const {
    startUsage,
    stopUsage,
    resetInventory,
    useSelectedOnlyOn,
    setUseSelectedOnlyOn,
    isUsingStock,
  } = useContext(InventoryContext);

  const { deliveriesOn, setDeliveriesOn } = useContext(OrdersContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [resetActive, setResetActive] = useState(false);

  useEffect(() => {
    setIsPlaying(isUsingStock);
  }, [isUsingStock]);

  useEffect(() => {}, [deliveriesOn]);

  const startUsageWithState = () => {
    startUsage();
    setIsPlaying(true);
    setResetActive(false);
  };

  const pauseUsageWithState = () => {
    stopUsage();
    setIsPlaying(false);
    setResetActive(false);
  };

  const resetInventoryWithState = () => {
    resetInventory();
    setIsPlaying(false);
    setResetActive(true);
    setTimeout(() => {
      setResetActive(false);
    }, 500);
  };

  const handleDeliveriesToggleChange = (event) => {
    setDeliveriesOn(event.target.checked);
  };

  // changed to only use selected by default
  const handleUseSelectedOnlyToggleChange = (event) => {
    setUseSelectedOnlyOn(event.target.checked);
  };

  const togglePlayStop = () => {
    if (isPlaying) {
      pauseUsageWithState();
    } else {
      startUsageWithState();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-4">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="text-lg text-cyan-700 "
          data-tooltip-id="select-products-info"
        />

        <Tooltip
          id="select-products-info"
          style={{ zIndex: 9999, position: "absolute" }}
        >
          <div>
            <p className="w-80 text-lg">
              {page === "inventory" &&
                `  Select a few products from the inventory then click "Use Stock". This
  will run down the stock for those selected products. When the "In Stock"
  hits the "Reorder At", you should see an order created for that
  product. Click the
  reset icon to reset with the original stock numbers.`}
              {page === "orders" &&
                `You can turn deliveries on (this delivers orders at
                    random times between 2 and 20 seconds) or manually deliver each
                    order with the edit icons in the table.`}
            </p>
          </div>
        </Tooltip>

        {page === "inventory" && (
          <>
            <div className="flex items-center gap-2">
              <button
                className={twMerge(
                  "whitespace-nowrap text-md hover:bg-zinc-200/70 py-1 px-4 rounded-md flex items-center gap-2 min-w-[120px]",
                  isPlaying ? "text-cyan-700" : "",
                )}
                onClick={togglePlayStop}
              >
                <span className="mx-auto">
                  {isPlaying ? "Pause" : "Use Stock"}
                </span>
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className={twMerge(
                    "text-sm text-zinc-500 hover:scale-125 transition-all duration-300 ease-linear",
                    isPlaying ? "text-cyan-700" : "",
                  )}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="whitespace-nowrap text-md hover:bg-zinc-200/70 py-1 px-4 rounded-md flex items-center gap-2"
                onClick={resetInventoryWithState}
              >
                Reset Stock
                <FontAwesomeIcon
                  icon={faRotateLeft}
                  className="text-base text-zinc-600 hover:scale-125 transition-all duration-300 ease-linear"
                />
              </button>
            </div>
          </>
        )}

        {page === "orders" && (
          <div className="flex items-center gap-2">
            <p className="whitespace-nowrap text-md py-1 px-4 rounded-md flex items-center gap-2">
              Deliveries On:
            </p>
            <label
              htmlFor="deliveriesToggle"
              aria-label="toggle deliveries on or off"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input
                  id="deliveriesToggle"
                  type="checkbox"
                  className="sr-only"
                  checked={deliveriesOn}
                  onChange={handleDeliveriesToggleChange}
                />
                <div className="block bg-cyan-700/40 w-10 h-6 rounded-full"></div>
                <div
                  className={`absolute left-1 top-1 bg-zinc-50 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out 
              ${deliveriesOn ? " translate-x-full" : ""}`}
                ></div>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* this below section was used to have play-selected-products-only option */
}
{
  /* <div className="use-selected-switch-container">
                        <p>Use Selected Only</p>
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    className="play-selected-only-switch"
                                    checked={useSelectedOnlyOn}
                                    onChange={handleUseSelectedOnlyToggleChange}
                                    inputProps={{ "aria-label": "Toggle switch" }}
                                    sx={{
                                        '& .MuiSwitch-thumb': {
                                            backgroundColor: 'var(--light-grey)',
                                        },
                                        '& .MuiSwitch-track': {
                                            backgroundColor: 'grey',
                                        },
                                        '&.Mui-checked .MuiSwitch-thumb': {
                                            backgroundColor: 'rgb(134, 208, 199)',
                                        },
                                        '&.Mui-checked .MuiSwitch-track': {
                                            backgroundColor: 'rgb(134, 208, 199)',
                                        },
                                    }}
                                />
                            }
                        // label="Toggle"
                        />
                    </div> */
}
{
  /* usageSpeed slider */
}
{
  /*  <div className="slider-container">
                        <p>Usage Speed</p>
                        <div className="slider">
                            <Slider
                                aria-label="Temperature"
                                defaultValue={1}
                                valueLabelDisplay="slow"
                                step={1}
                                marks
                                min={1}
                                max={5}
                                sx={{
                                    width: '100px',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: 'var(--light-grey)',
                                        borderColor: '',
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: 'rgb(134, 208, 199)',
                                        borderColor: 'rgb(134, 208, 199)',
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: 'grey',
                                    },
                                }}
                            />
                        </div>
                    </div> */
}
