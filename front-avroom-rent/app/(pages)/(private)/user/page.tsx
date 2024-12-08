"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/user.store";
import Link from "next/link";
import { getUsers } from "@/app/api/user/user.api";
import { Pagination } from "@/app/components/pagination";
import { GeneralFilter } from "@/app/components/general.filter";
import type { User } from "@/app/utils/types/user.types";
import { Role } from "@/app/utils/types/user.types";

export default function User() {
  const {
    users,
    currentPage,
    errorMessage,
    setUsers,
    setCurrentPage,
    setErrorMessage,
  } = useUserStore();
  const itemsPerPage = 5;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    if (users.length === 0) {
      const fetchUsers = async () => {
        try {
          const data = await getUsers();
          console.log("Usuarios obtenidos:", data);
          setUsers(data);
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
          setErrorMessage("No se pudieron cargar los usuarios.");
        }
      };

      fetchUsers();
    }
  }, [users, setUsers, setErrorMessage]);

  const filteredUsers = users.filter((user: User) => {
    const matchesSearchQuery = filters.searchQuery === "" || user.username.includes(filters.searchQuery);
    const matchesRole = filters.role === "" || user.role === filters.role;
    const matchesEmail = filters.email === "" || user.email.includes(filters.email);

    return matchesSearchQuery && matchesRole && matchesEmail;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value || "" }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl uppercase text-center font-bold text-gray-700 mb-4">
        Lista de Usuarios
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
          onFilterChange={handleFilterChange}
          roles={Object.values(Role)}
        />
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded shadow-lg bg-white">
        <table className="table-auto w-full border-collapse text-sm">
          <thead className="bg-gray-300 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Fecha de Creación</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user: User) => (
              <tr key={user.id.toString()} className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3 truncate max-w-[200px]" title={user.username || undefined}>
                  {user.username}
                </td>
                <td className="px-4 py-3 truncate max-w-[250px]" title={user.email || undefined}>
                  {user.email}
                </td>
                <td className="px-4 py-3 truncate max-w-[150px]" title={new Date(user.dateCreation).toLocaleDateString() || undefined}>
                  {new Date(user.dateCreation).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 truncate max-w-[150px]" title={user.role || undefined}>
                  {user.role}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/user/${user.id}`}>
                    <button className="px-4 py-2 text-primaryColor focus:outline-none">
                      Ver Detalles
                    </button>
                  </Link>
                  <Link href={`/user/${user.id}`}>
                    <button className="px-4 py-2 text-primaryColor hover:text-primaryColorDark focus:outline-none ml-2">
                      Modificar
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}