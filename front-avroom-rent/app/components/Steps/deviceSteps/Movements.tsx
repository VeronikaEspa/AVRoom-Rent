"use client";

import Pagination from "@/app/components/Table/Pagination";
import ItemsPerPageSelector from "@/app/components/Table/ItemPerPageSelector";
import { useState, useMemo } from "react";
import { IMovementWithUsername } from "@/app/utils/types/movement.types";

interface MovementsProps {
  movements: IMovementWithUsername[];
}

export default function Movements({ movements }: MovementsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const paginatedMovements = useMemo(() => {
    if (!Array.isArray(movements) || movements.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return movements.slice(startIndex, startIndex + itemsPerPage);
  }, [movements, currentPage, itemsPerPage]);

  return (
    <div>
      <div className="my-4">
        <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div className="rounded-lg text-sm overflow-auto h-[400px] flex items-start justify-center">
        {paginatedMovements.length > 0 ? (
          <table className="w-full bg-white">
            <thead className="bg-primaryColor text-white">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Fecha Préstamo</th>
                <th className="px-4 py-2 text-left font-medium">Fecha Esperada Devolución</th>
                <th className="px-4 py-2 text-left font-medium">Fecha Real Devolución</th>
                <th className="px-4 py-2 text-left font-medium">Estado</th>
                <th className="px-4 py-2 text-left font-medium">Tipo</th>
                <th className="px-4 py-2 text-left font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovements.map((movement, index) => (
                <tr
                  key={`${movement.deviceId}-${index}`}
                  className={`hover:bg-gray-200 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-gray-900">
                    {movement.loanDate ? new Date(movement.loanDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-900">
                    {movement.returnDateExpected
                      ? new Date(movement.returnDateExpected).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-900">
                    {movement.returnDateActual
                      ? new Date(movement.returnDateActual).toLocaleDateString()
                      : "No devuelto"}
                  </td>
                  <td className="px-4 py-2 text-gray-900">
                    <span
                      className={`px-2 py-1 rounded ${
                        movement.loanStatus === "active"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {movement.loanStatus === "active" ? "Activo" : "Completado"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-900">{movement.type}</td>
                  <td className="px-4 py-2 text-gray-900">
                    {movement.description || "Sin descripción"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay movimientos registrados.</p>
        )}
      </div>
      <Pagination
        totalPages={Math.ceil(movements.length / itemsPerPage)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}