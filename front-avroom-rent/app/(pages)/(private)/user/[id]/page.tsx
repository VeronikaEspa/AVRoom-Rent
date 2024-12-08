"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/app/store/user.store";
import { getUsers, updateUser } from "@/app/api/user/user.api";

export default function EditUser() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { users, setUsers } = useUserStore();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    setIsClient(true);
    if (id) {
      const fetchUser = async () => {
        try {
          const data = await getUsers();
          const selectedUser = data.find((u) => u.id.toString() === id.toString());
          if (selectedUser) {
            setUser(selectedUser);
          } else {
            setErrorMessage("Usuario no encontrado.");
          }
        } catch (error) {
          setErrorMessage("Error al obtener los datos del usuario.");
          console.error(error);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(user.id, user);
      console.log("Usuario actualizado:", updatedUser);

      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, ...updatedUser } : u
      );
      setUsers(updatedUsers);

      router.push("/user");
    } catch (error) {
      setErrorMessage("Hubo un error al guardar los cambios.");
      console.error(error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Editar Usuario</h1>
      {errorMessage && (
        <div className="mb-4 w-full max-w-lg bg-red-100 text-red-700 p-3 rounded">
          {errorMessage}
        </div>
      )}
      {user ? (
        <div className="bg-white shadow-lg rounded p-6 w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario:
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol:
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="superAdmin">Super Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primaryColor text-white rounded shadow hover:bg-primaryColorDark focus:outline-none focus:ring-2 focus:ring-primaryColor"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Cargando...</p>
      )}
    </div>
  );
}
