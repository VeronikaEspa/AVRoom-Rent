"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import DeviceDetails from "@/app/components/Steps/deviceSteps/DeviceDetails";
import Movements from "@/app/components/Steps/deviceSteps/Movements";
import { IMovementWithUsername } from "@/app/utils/types/movement.types";
import { Device } from "@/app/utils/types/device.types";
import { getCookie } from "@/app/utils/functions/cookies";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [movements, setMovements] = useState<IMovementWithUsername[]>([]);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [movementsError, setMovementsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detalles");

  const getUserIdFromToken = (): string | null => {
    try {
      const token = getCookie("token");
      if (token) {
        const decoded: { id: string } = jwt.decode(token) as { id: string };
        return decoded.id;
      }
      return null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get(`/api/device/read?id=${id}`);
        setDevice(response.data);
      } catch (error) {
        console.error("Error fetching device data:", error);
        setDeviceError("Error fetching device data.");
        setDevice(null);
      }
    };

    const fetchMovementsWithUsernames = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setMovementsError("User ID not found in token.");
          setMovements([]);
          return;
        }

        const movementsResponse = await axios.get(`/api/movement/${id}/device`);
        const movements = movementsResponse.data;
        setMovements(movements);
      } catch (error) {
        console.error("Error fetching movements data:", error);
        setMovementsError("Error fetching movements data.");
        setMovements([]);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchDeviceData(), fetchMovementsWithUsernames()]);
      setIsLoading(false);
    };

    if (id) {
      fetchData();
    } else {
      setDeviceError("Invalid device ID.");
      setMovementsError("Invalid device ID.");
      setIsLoading(false);
    }
  }, [id]);

  const handleTabClick = (tab: SetStateAction<string>) => setActiveTab(tab);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  const hasActiveLoan = movements.some(
    (movement) => movement.loanStatus === "active"
  );

  return (
<div className="p-6">
      <div className="flex justify-between mb-4">
        <Link
          href="/device"
          className="px-4 py-2 rounded-md text-sm"
        >
          {"<< " + "Inventario"}
        </Link>

        <div className="flex space-x-2">
          {!hasActiveLoan ? (
            <Link
              href={`/device/${id}/loan`}
              className="bg-primaryColor text-white px-4 py-2 rounded-md text-sm hover:bg-primaryColorDark transition-all"
            >
              Añadir Préstamo
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed opacity-50"
              title="Ya tienes un préstamo activo para este dispositivo."
            >
              Añadir Préstamo
            </button>
          )}

          <Link
            href={`/device/${id}/loan/return`}
            className="bg-primaryColor text-white px-4 py-2 rounded-md text-sm hover:bg-primaryColorDark transition-all"
          >
            Devolver
          </Link>
        </div>
      </div>

      <div className="relative flex items-center gap-4 mb-4">
        <div className="absolute bottom-0 left-0 right-0 border-b border-primaryColor z-0"></div>

        <button
          onClick={() => handleTabClick("detalles")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "detalles"
              ? "border border-primaryColor border-b-white bg-white rounded-t text-black"
              : "border border-primaryColor text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Detalles del dispositivo
        </button>
        <button
          onClick={() => handleTabClick("movimientos")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "movimientos"
              ? "border border-primaryColor border-b-white bg-white rounded-t text-black"
              : "border border-primaryColor text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Movimientos
        </button>
      </div>

      {activeTab === "detalles" && (
        <DeviceDetails device={device} lastMovementDate={null} />
      )}
      {activeTab === "movimientos" && <Movements movements={movements} />}

      {deviceError && <p className="text-red-500 mt-4">{deviceError}</p>}
      {movementsError && (
        <p className="text-red-500 mt-4">{movementsError}</p>
      )}
    </div>
  );
}