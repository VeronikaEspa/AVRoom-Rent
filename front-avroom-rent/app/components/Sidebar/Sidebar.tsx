"use client";

import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-1 left-3 p-2 bg-primaryColor text-white rounded z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HiMenu className="text-2xl" />
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-primaryColor text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
        style={{ width: "250px" }}
      >
        <div className="flex flex-col items-start mt-4 px-4">
          <a
            href="/device"
            className="py-2 px-2 mt-[30px] w-full rounded hover:bg-primaryColorDark transition-colors"
          >
            Material
          </a>
           {/* <a
            href="/config"
            className="py-2 px-2 w-full rounded hover:bg-primaryColorDark transition-colors"
          >
            Configuraciones
          </a> */}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;