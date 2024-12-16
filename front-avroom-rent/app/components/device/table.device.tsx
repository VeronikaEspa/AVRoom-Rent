import React from "react";
import { HiChevronRight } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { Device } from "@/app/utils/types/device.types";
import { Role } from "@/app/utils/types/user.types";

interface DevicesTableProps {
  devices: Device[];
  userRole: Role;
}

export const DevicesTable: React.FC<DevicesTableProps> = ({
  devices,
  userRole,
}) => {
  return (
    <div className="overflow-x-auto rounded shadow-lg bg-white">
      <table className="table-auto w-full border-collapse text-sm">
        <thead className="bg-gray-300 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-left">Disponibilidad</th>
            {userRole === Role.ADMIN && (
              <th className="px-4 py-2 text-center">Acciones</th>
            )}
            <th className="px-4 py-2 text-center">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr
              key={device.id.toString()}
              className="border-b bg-white hover:bg-gray-50"
            >
              <td
                className="px-4 py-3 truncate max-w-[200px]"
                title={device.name || undefined}
              >
                {device.name}
              </td>
              <td
                className="px-4 py-3 truncate max-w-[200px]"
                title={device.description || undefined}
              >
                {device.description}
              </td>
              <td
                className="px-4 py-3 truncate max-w-[200px]"
                title={device.category || undefined}
              >
                {device.category}
              </td>
              <td
                className="px-4 py-3 truncate"
                title={device.available ? "Sí" : "No"}
              >
                <span
                  className={`px-2 py-1 rounded max-w-[10px] ${
                    device.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {device.available ? "Sí" : "No"}
                </span>
              </td>
              {userRole === Role.ADMIN && (
                <td className="px-4 py-3 text-center">
                  <Link href={`/device/${device.id}`}>
                    <button className="px-4 py-2 text-primaryColor focus:outline-none">
                      <HiChevronRight className="text-xl" />
                    </button>
                  </Link>
                </td>
              )}
              <td className="px-4 py-3 text-center">
                <Link href={`/device/${device.id}/details`}>
                  <button className="px-4 py-2 text-primaryColor focus:outline-none">
                    <FaArrowRight className="inline-block" />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};