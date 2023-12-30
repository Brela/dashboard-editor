import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "../../../components";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { primaryColor } from "../../../css/globalTailwindVars";
import { toast } from "react-hot-toast";

const WidgetContent = ({ isEditMode, block, IconComponent }) => {
  const [linkHover, setLinkHover] = useState();
  const navigate = useNavigate();

  return (
    <div className=" overflow-visible">
      <dt className=" overflow-visible">
        <div
          className="absolute rounded-md p-2 md:p-3 hidden sm:block "
          style={{
            backgroundColor: primaryColor,
          }}
        >
          {IconComponent ? (
            <IconComponent className="h-5 w-5 text-white" aria-hidden="true" />
          ) : (
            <span className=" text-white">-</span>
          )}
        </div>
        {/* <p className="ml-0 sm:ml-16 truncate text-sm font-medium text-gray-500"> */}
        <p className="ml-0 sm:ml-16 whitespace-wrap text-md font-medium text-gray-800">
          {block.name}
        </p>
      </dt>
      <dd className="ml-0 sm:ml-16 flex items-end pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900 ">{block.value}</p>
        {block.error && (
          <div>
            <Tooltip
              content={block.error}
              position="bottom"
              effect="solid"
              // border={true}
              type="light"
              className="w-[200px] text-xs ml-10"
            >
              <ExclamationTriangleIcon
                className="h-3 w-3 mt-2 ml-1"
                style={{
                  color: `${primaryColor}`,
                }}
              />
            </Tooltip>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-2 sm:px-6">
          <div className="text-sm">
            <div
              className={twMerge(
                "font-medium",
                !isEditMode ? "cursor-pointer" : "",
              )}
              style={{
                color:
                  linkHover === block.i ? `${primaryColor}90` : primaryColor,
              }}
              onMouseEnter={() => {
                // using block.i as a key
                if (!isEditMode) {
                  setLinkHover(block.i);
                }
              }}
              onClick={() => {
                toast("This feature is disabled for Demo");
                /*   if (!isEditMode) {
                  navigate(block.navigationUrl);
                } */
              }}
              onMouseLeave={() => {
                setLinkHover(null);
              }}
            >
              {" "}
              View all
              <span className="sr-only"> {block.name} stats</span>
            </div>
          </div>
        </div>
      </dd>
    </div>
  );
};

export default WidgetContent;
