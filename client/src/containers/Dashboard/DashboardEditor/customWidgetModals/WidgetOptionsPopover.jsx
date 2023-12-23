import React from "react";
import { Popover, Button } from "../../../../components";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const EditWidgetPopover = ({ setModal, id }) => {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Popover
        contentClassName="p-0 m-2 mr-5"
        trigger={
          <div className="p-1 hover:bg-gray-200 rounded-md">
            <EllipsisVerticalIcon className="h-4 w-4" />
          </div>
        }
        content={
          <div className="z-10 mt-2 py-2 px-5 rounded-md bg-white shadow-lg ring-1 ring-gray-700 ring-opacity-20 focus:outline-none">
            <section className="flex gap-2 items-center">
              <Button variant="ghost" size="xs" className="px-0">
                <PencilSquareIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                className="px-0"
                onClick={() => setModal({ name: "deleteWidget", id: id })}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </section>
          </div>
        }
      />
    </div>
  );
};

export default EditWidgetPopover;
