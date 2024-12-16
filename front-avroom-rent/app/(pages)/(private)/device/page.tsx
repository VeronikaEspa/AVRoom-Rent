"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDeviceStore } from "@/app/store/device.store";
import { DevicesTable } from "@/app/components/device/table.device";
import { Pagination } from "@/app/components/pagination";
import { GeneralFilter } from "@/app/components/general.filter";
import { Role } from "@/app/utils/types/user.types";

interface DecodedToken {
  role: Role;
}

export default function Device() {
  const {
    devices = [], // Asegúrate de que sea un arreglo por defecto
    currentPage,
    errorMessage,
    setDevices,
    setCurrentPage,
    setErrorMessage,
  } = useDeviceStore();

  const [userRole, setUserRole] = useState<Role | null>(null);

  type SortableKeys = "name" | "category";

  const [filters, setFilters] = useState<{
    searchQuery: string;
    category: string;
    availability: string;
    sortBy: SortableKeys | null;
  }>({
    searchQuery: "",
    category: "",
    availability: "",
    sortBy: null,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDevicesData = async () => {
      try {
        const response = await fetch("/api/device/read");
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setErrorMessage("No se pudieron cargar los dispositivos.");
      }
    };
    fetchDevicesData();
  }, [setDevices, setErrorMessage]);

  const handleFilterChange = (key: string, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filteredDevices = (devices || [])
    .filter((device) =>
      device.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
    .filter((device) =>
      filters.category ? device.category === filters.category : true
    )
    .filter((device) => {
      if (userRole === Role.STUDENT) {
        return device.available === true;
      }
      return filters.availability
        ? device.available === (filters.availability === "true")
        : true;
    })
    .sort((deviceA, deviceB) => {
      if (!filters.sortBy) return 0;

      const valueA = deviceA[filters.sortBy];
      const valueB = deviceB[filters.sortBy];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB);
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const currentDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [...new Set(devices.map((device) => device.category))];

  return (
    <div className="p-4">
      <h1 className="text-xl uppercase text-center font-bold text-gray-700 mb-4">
        Materiales registrados
      </h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Botón de filtros */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColorDark focus:outline-none"
        >
          {isFilterOpen ? "Ocultar Filtros" : "Filtros"}
        </button>
      </div>

      {/* Panel de Filtros */}
      {isFilterOpen && (
        <GeneralFilter
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Tabla */}
      {userRole && (
        <DevicesTable devices={currentDevices} userRole={userRole} />
      )}

      {/* Botones de administrador */}
      {userRole === Role.ADMIN && (
        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2">
            Añadir Objeto
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Añadir Movimiento
          </button>
        </div>
      )}

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}