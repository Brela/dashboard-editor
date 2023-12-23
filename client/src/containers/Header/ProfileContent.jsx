import React from "react";
import { startCase } from "lodash";

const ProfileContent = ({ loggedInUser }) => (
  console.log(loggedInUser),
  (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl text-gray-700 font-semibold mb-1">Profile</h2>
      <p className="text-base">
        Username:{" "}
        <span className="font-bold">{startCase(loggedInUser.username)}</span>
      </p>
      <p className="text-base ">
        Account Created:{" "}
        <span className="font-bold">
          {new Date(loggedInUser.createdAt)
            .toLocaleDateString()
            .replaceAll("/", "-")}
        </span>
      </p>
    </div>
  )
);

export default ProfileContent;
