// index.jsx
import * as React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { twMerge } from "tailwind-merge";

const Popover = ({ trigger, content, contentClassName, triggerClassName }) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger className={twMerge(triggerClassName)}>
      {trigger}
    </RadixPopover.Trigger>
    <RadixPopover.Portal>
      <RadixPopover.Content
        className={twMerge(
          "bg-white shadow-lg p-3 rounded-md z-[9999]",
          contentClassName
        )}
      >
        {content}
        <RadixPopover.Arrow fill="gray" />
      </RadixPopover.Content>
    </RadixPopover.Portal>
  </RadixPopover.Root>
);

// use this if you want to close on click on an item
const CloseOnClickItem = ({ children, onClick, ...rest }) => {
  return (
    <RadixPopover.Close onClick={onClick} {...rest}>
      {children}
    </RadixPopover.Close>
  );
};

Popover.CloseOnClickItem = CloseOnClickItem;
export default Popover;
