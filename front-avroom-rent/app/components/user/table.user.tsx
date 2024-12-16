import React from "react";
import { HiChevronRight } from "react-icons/hi";
import Link from "next/link";
import { IUser } from "@/app/utils/types/user.types";

interface UsersTableProps {
  users: IUser[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
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
          {users.map((user) => (
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
                <Link href={`/dashboard/user/${user.id}`}>
                  <button className="px-4 py-2 text-primaryColor focus:outline-none">
                    <HiChevronRight className="text-xl" />
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