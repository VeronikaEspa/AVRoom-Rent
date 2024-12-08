import React from "react";

interface GeneralFilterProps {
  filters: {
    searchQuery: string;
    role?: string;
    email?: string;
    category?: string;
    availability?: string;
    sortBy?: string | null;
  };
  onFilterChange: (key: string, value: string | null) => void;
  roles?: string[];
  categories?: string[];
}

export const GeneralFilter: React.FC<GeneralFilterProps> = ({
  filters,
  onFilterChange,
  roles,
  categories,
}) => {
  return (
    <div className="mb-4 py-3 px-4 rounded bg-gray-100 text-sm shadow-md grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filters.searchQuery}
        onChange={(e) => onFilterChange("searchQuery", e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded"
      />
      {roles && (
        <select
          value={filters.role || ""}
          onChange={(e) => onFilterChange("role", e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Filtrar por rol</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      )}
      {categories && (
        <select
          value={filters.category || ""}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Filtrar por categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        placeholder="Buscar por email..."
        value={filters.email || ""}
        onChange={(e) => onFilterChange("email", e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded"
      />
      {filters.availability !== undefined && (
        <select
          value={filters.availability || ""}
          onChange={(e) => onFilterChange("availability", e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Filtrar por disponibilidad</option>
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>
      )}
      {/* {filters.sortBy !== undefined && (
        <select
          value={filters.sortBy || ""}
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Ordenar por</option>
          <option value="name">Nombre</option>
          <option value="category">Categoría</option>
        </select>
      )} */}
    </div>
  );
};