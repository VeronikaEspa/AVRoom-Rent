"use client";

import { useEffect, useState } from "react";
import { getDevices } from "@/app/api/device/device.api";
import { useDeviceStore } from "@/app/store/device.store";
import { DevicesTable } from "@/app/components/device/table.device";
import { Pagination } from "@/app/components/pagination";
import { GeneralFilter } from "@/app/components/general.filter";

export default function Device() {
  const {
    devices,
    currentPage,
    errorMessage,
    setDevices,
    setCurrentPage,
    setErrorMessage,
  } = useDeviceStore();

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
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch {
        setErrorMessage("No se pudieron cargar los dispositivos.");
      }
    };
    fetchDevices();
  }, [setDevices, setErrorMessage]);

  const handleFilterChange = (key: any, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filteredDevices = devices
    .filter((device) =>
      device.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
    .filter((device) =>
      filters.category ? device.category === filters.category : true
    )
    .filter((device) =>
      filters.availability
        ? device.available === (filters.availability === "true")
        : true
    )
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
      <DevicesTable devices={currentDevices} />

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}