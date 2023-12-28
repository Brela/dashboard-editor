import React from "react";
import { startCase } from "lodash";
import { ClockIcon } from "@heroicons/react/24/solid";

const ProfileContent = ({ loggedInUser }) => (
  console.log(loggedInUser),
  (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl text-gray-700 font-semibold mb-1">Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <p className="text-base">Username:</p>
        <p className="text-base font-bold">
          {startCase(loggedInUser.username)}
        </p>
        <p className="text-base">Account Created:</p>
        <p className="text-base font-bold">
          {new Date(loggedInUser.createdAt)
            .toLocaleDateString()
            .replaceAll("/", "-")}
        </p>
      </div>
      {loggedInUser?.isTempAccount && (
        <div className="mt-3 flex gap-2">
          <ClockIcon className="h-7 w-7 text-orange-500/70" />
          <p className="text-orange-500 font-semi-bold">
            This guest account will be autommatically deleted from the database.
          </p>
        </div>
      )}
    </div>
  )
);

export default ProfileContent;
