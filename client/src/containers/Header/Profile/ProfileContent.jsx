import React from "react";
import { startCase } from "lodash";
import { ClockIcon } from "@heroicons/react/24/solid";

const DetailsModal = ({ user }) => (
  console.log(user),
  (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl text-gray-700 font-semibold mb-1">Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <p className="text-base">Username:</p>
        <p className="text-base font-bold">
          {user ? startCase(user.username.replace(/\s+/g, "")) : "Guest"}
        </p>

        <p className="text-base">Account Created:</p>
        <p className="text-base font-bold">
          {user
            ? new Date(user?.iatReadable)
                .toLocaleDateString()
                .replaceAll("/", "-")
            : new Date().toLocaleDateString().replaceAll("/", "-")}
        </p>
      </div>
      {/* {user?.isTempAccount && ( */}
      <div className="mt-3 flex gap-2">
        <ClockIcon className="h-7 w-7 text-orange-600/70" />
        <p className="text-orange-500 font-semi-bold">
          This guest account will be autommatically deleted from the database at
          a later time.
        </p>
      </div>
      {/* )} */}
    </div>
  )
);

export default DetailsModal;
