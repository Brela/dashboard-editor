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

export default function DemoControls() {
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
    <div
      className={twMerge(
        "flex gap-10 lg:justify-center items-center w-auto border lg:mx-[15vw] mb-4 px-2 py-3 rounded-2xl ",
        headerBg,
      )}
    >
      <div className="flex gap-3 items-center px-4 p-2 ">
        <div className="flex items-center gap-2">
          <span className="text-md text-slate-700">
            Automate Stock Usage and Order Deliveries:
          </span>
        </div>
        <div className="flex items-center hover:cursor-pointer">
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="text-xl text-zinc-400"
            data-tooltip-id="my-tooltip-children-multiline"
          />
          <Tooltip id="my-tooltip-children-multiline">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p className="w-80">
                {`Select a few products from the inventory then hit play. This
                will run down the stock for those products. When the "Stock"
                hits the "Target", you should see an order created for that
                product. You can turn deliveries on (this delivers orders at
                random times between 2 and 20 seconds) or manually deliver each
                order with the edit icon in the 'Active Orders' tab. Click the
                reset icon to reset with the original stock numbers.`}
              </p>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 px-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-zinc-700">Use Stock:</p>
          <button
            className={`px-1 w-auto h-7.5 ${isPlaying ? "" : ""}`}
            onClick={togglePlayStop}
          >
            <FontAwesomeIcon
              icon={isPlaying ? faPause : faPlay}
              className="text-base text-zinc-600 hover:scale-125 transition-all duration-300 ease-linear"
            />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-zinc-700">Reset Stock:</p>
          <button
            className={`px-1 w-auto h-7.5 ${resetActive ? "" : ""}`}
            onClick={resetInventoryWithState}
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              className="text-base text-zinc-600 hover:scale-125 transition-all duration-300 ease-linear"
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-zinc-700">
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
