import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreativeCommons } from "@fortawesome/free-brands-svg-icons";
import React from "react";

function Footer() {
  return (
    <footer className="flex justify-center items-center  w-full">
      <div className=" flex gap-1 items-center">
        <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
          <FontAwesomeIcon
            icon={faCreativeCommons}
            className="text-lg text-black/60"
          />
        </a>

        <span className="text-sm text-black/60">
          Inventory Copilot 2023. Created by{" "}
          <a
            href="https://www.linkedin.com/in/clayton-breland"
            className="underline hover:text-black/80"
            target="_blank"
          >
            Clay Breland
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
