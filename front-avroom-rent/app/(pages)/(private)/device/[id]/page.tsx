"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDeviceMovements } from "@/app/api/movement/movement.api";

export default function DeviceMovements() {
  const [movements, setMovements] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const { id } = useParams();
  const idDevice = id;

  useEffect(() => {
    if (!idDevice) return;

    const fetchMovements = async () => {
      setIsLoading(true);
      try {
        const data = await getDeviceMovements(idDevice as string);

        if (Array.isArray(data)) {
          setMovements(data);
          setErrorMessage(null);
        } else {
          setErrorMessage("No se pudieron cargar los movimientos.");
        }
      } catch (error) {
        console.error("Error al obtener los movimientos:", error);
        setErrorMessage("No se pudieron cargar los movimientos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovements();
  }, [idDevice]);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const renderTable = () => (
    <div className="overflow-x-auto rounded shadow-lg bg-white mt-4">
      <table className="table-auto w-full border-collapse text-sm">
        <thead className="bg-gray-300 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Nombre de Usuario</th>
            <th className="px-4 py-2 text-left">Fecha de Préstamo</th>
            <th className="px-4 py-2 text-left">Fecha Esperada de Devolución</th>
            <th className="px-4 py-2 text-left">Fecha Real de Devolución</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement, index) => (
            <tr
              key={index}
              className={`border-b ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-3 truncate">{movement.userName}</td>
              <td className="px-4 py-3">
                {new Date(movement.loanDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {new Date(movement.returnDateExpected).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {movement.returnDateActual
                  ? new Date(movement.returnDateActual).toLocaleDateString()
                  : "No Devuelto"}
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
  );

  const renderForm = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-bold mb-4">Agregar Nuevo Movimiento</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de Usuario
            </label>
            <input
              type="text"
              placeholder="Ingrese el nombre del usuario"
              className="mt-1 px-3 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Préstamo
            </label>
            <input
              type="date"
              className="mt-1 px-3 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha Esperada de Devolución
            </label>
            <input
              type="date"
              className="mt-1 px-3 py-2 border rounded w-full"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-primaryColorDark"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-xl uppercase text-center font-bold text-gray-700 mb-4">
        Movimientos del Dispositivo
      </h1>

      {isLoading && <p className="text-center text-gray-500">Cargando...</p>}
      {errorMessage && (
        <p className="text-center text-red-500">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && movements.length === 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-500">No hay movimientos registrados aún.</p>
          <button
            onClick={openForm}
            className="mt-4 px-4 py-2 bg-primaryColor text-white rounded hover:bg-primaryColorDark focus:outline-none"
          >
            Agregar Movimiento
          </button>
        </div>
      )}

      {movements.length > 0 && (
        <>
          <div className="mb-4">
            <button
              onClick={openForm}
              className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-primaryColorDark"
            >
              Agregar Movimiento
            </button>
          </div>
          {renderTable()}
        </>
      )}

      {isFormOpen && renderForm()}
    </div>
  );
}
