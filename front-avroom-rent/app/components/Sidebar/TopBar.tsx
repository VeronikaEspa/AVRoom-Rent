"use client";

import React from "react";
import { HiLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

const TopBar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Error during logout");
      }
    } catch (error) {
      console.error("Network or server error during logout", error);
    }
  };

  return (
    <div
      className="bg-primaryColor text-white flex items-center"
      style={{
        width: "100%",
        height: "50px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 5000,
      }}
    >
      <div className="justify-between flex w-full px-5 ml-[40px]">
        <h1 className="font-bold self-center text-lg">AVRoom</h1>

        <button
          className="font-bold py-1 px-3 flex border-none items-center gap-2 bg-transparent hover:bg-gray-700 rounded"
          onClick={handleLogout}
        >
          <HiLogout className="text-xl" />
        </button>
      </div>
      <Sidebar />
    </div>
  );
};

export default TopBar;