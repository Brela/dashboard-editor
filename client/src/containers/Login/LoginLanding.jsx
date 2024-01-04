import React from "react";
import LoginForm from "./LoginForm";

const LoginLanding = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className=" gap-4 bg-zinc-100 min-h-[70vh] max-w-2xl p-4 px-8 rounded-3xl drop-shadow-xl  mx-4">
        <div className=" flex flex-col gap-4 rounded-3xl  ">
          <div className="flex flex-col gap-8 lg:gap-4 lg:flex-row justify-evenly items-center ">
            <div className="flex flex-col justify-center  w-full lg:w-2/3 bg-zinc-100 rounded-3xl p-4">
              <span className=" font-bold text-5xl mb-4 bg-gradient-to-r from-slate-700 to-cyan-700 bg-clip-text text-transparent">
                Inventory Copilot
              </span>

              <h1 className="text-xl font-bold text-slate-600 tracking-wide   ">
                Manage Inventory and Automate Restock Orders
              </h1>
            </div>
            <div className="">
              <LoginForm />
            </div>
          </div>

          <div className="rounded-3xl flex justify-center pb-4  ">
            <img
              src="/orderlypreview.png"
              className="rounded-3xl   lg:max-w-screen-xs   "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;
