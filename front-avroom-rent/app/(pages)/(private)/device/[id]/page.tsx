"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Device } from "@/app/utils/types/device.types";
import { IMovementWithUsername } from "@/app/utils/types/movement.types";
import { Role } from "@/app/utils/types/user.types";

export default function DeviceDetailsPage({ userRole }: { userRole: Role }) {
  const { id } = useParams();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [movements, setMovements] = useState<IMovementWithUsername[]>([]);
  const [activeTab, setActiveTab] = useState("detalles");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        if (!id) {
          setErrorMessage("ID de dispositivo no válido.");
          return;
        }

        const [deviceResponse, movementsResponse] = await Promise.all([
          fetch(`/api/device/read?id=${id}`).then((res) => res.json()),
          fetch(`/api/device/${id}/movement`).then((res) => res.json()),
        ]);

        setDevice(deviceResponse);
        setMovements(movementsResponse);
      } catch (error) {
        console.error("Error al cargar datos del dispositivo:", error);
        setErrorMessage("No se pudieron cargar los datos del dispositivo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceData();
  }, [id]);

  const handleTabClick = (tab: string) => setActiveTab(tab);

  if (isLoading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (errorMessage) return <p className="text-center text-red-500">{errorMessage}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-700 mb-4">Detalles del Dispositivo</h1>

      <div className="flex gap-4 border-b border-primaryColor mb-6">
        <button
          onClick={() => handleTabClick("detalles")}
          className={`px-4 py-2 font-medium transition-all duration-300 border rounded-t ${
            activeTab === "detalles"
              ? "bg-white border-primaryColor text-black"
              : "bg-gray-100 text-gray-500 hover:text-black"
          }`}
        >
          Detalles
        </button>
        <button
          onClick={() => handleTabClick("movimientos")}
          className={`px-4 py-2 font-medium transition-all duration-300 border rounded-t ${
            activeTab === "movimientos"
              ? "bg-white border-primaryColor text-black"
              : "bg-gray-100 text-gray-500 hover:text-black"
          }`}
        >
          Movimientos
        </button>
      </div>

      {activeTab === "detalles" && device && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{device.name}</h2>
          <p className="text-gray-600 mb-6">{device.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="block text-gray-700">Categoría:</strong>
              <span>{device.category}</span>
            </div>
            <div>
              <strong className="block text-gray-700">Disponibilidad:</strong>
              <span>{device.available ? "Disponible" : "No disponible"}</span>
            </div>
          </div>

          {userRole === Role.ADMIN && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => router.push(`/device/${id}/details`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Editar Dispositivo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "movimientos" && (
        <div className="overflow-x-auto rounded shadow-lg bg-white mt-4">
          <table className="table-auto w-full border-collapse text-sm">
            <thead className="bg-gray-300 uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Usuario</th>
                <th className="px-4 py-2 text-left">Fecha Préstamo</th>
                <th className="px-4 py-2 text-left">Fecha Esperada Devolución</th>
                <th className="px-4 py-2 text-left">Fecha Real Devolución</th>
                <th className="px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-4 py-3 truncate">{movement.username || "Desconocido"}</td>
                  <td className="px-4 py-3">
                    {movement.loanDate
                      ? new Date(movement.loanDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {movement.returnDateExpected
                      ? new Date(movement.returnDateExpected).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {movement.returnDateActual
                      ? new Date(movement.returnDateActual).toLocaleDateString()
                      : "No devuelto"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        movement.loanStatus === "active"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {movement.loanStatus === "active" ? "Activo" : "Devuelto"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}