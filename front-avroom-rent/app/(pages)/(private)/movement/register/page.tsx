"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Asegúrate de tener axios instalado
import { getCookie } from "@/app/utils/functions/cookies";
import jwt from "jsonwebtoken";

interface MovementFormData {
  deviceId: string;
  userId: string;
  loanDate: string;
  returnDateExpected: string;
  description: string;
  type: "loan" | "return"; // Nuevo campo para el tipo de movimiento
}

interface User {
  id: string;
  username: string;
}

interface Device {
  id: string;
  name: string;
}

export default function RegisterMovementPage() {
  const [formData, setFormData] = useState<MovementFormData>({
    deviceId: "",
    userId: "",
    loanDate: "",
    returnDateExpected: "",
    description: "",
    type: "loan", // Valor por defecto
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState<boolean>(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorDevices, setErrorDevices] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();

  const getToken = (): string | null => {
    try {
      const token = getCookie("token");
      return token || null;
    } catch (error) {
      console.error("Error obteniendo el token:", error);
      return null;
    }
  };

  // Fetch de usuarios y dispositivos al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get("/api/movement/register/read?type=users");
        setUsers(response.data.users); // Cambiado de 'username' a 'users'
      } catch (error: any) {
        console.error("Error fetching users:", error);
        setErrorUsers("No se pudieron cargar los usuarios.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchDevices = async () => {
      setIsLoadingDevices(true);
      try {
        const response = await axios.get("/api/movement/register/read?type=devices");
        setDevices(response.data.devices);
      } catch (error: any) {
        console.error("Error fetching devices:", error);
        setErrorDevices("No se pudieron cargar los dispositivos.");
      } finally {
        setIsLoadingDevices(false);
      }
    };

    fetchUsers();
    fetchDevices();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await axios.post(
        "/api/movement/register/create",
        {
          deviceId: formData.deviceId,
          userId: formData.userId,
          loanDate: formData.loanDate,
          returnDateExpected: formData.returnDateExpected,
          description: formData.description,
          type: formData.type, // Enviar el tipo de movimiento
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Movimiento registrado exitosamente.");
        router.push(`/device`);
      } else {
        throw new Error("Failed to register movement.");
      }
    } catch (error: any) {
      console.error("Error registering movement:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Error al registrar el movimiento."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Registrar Movimiento</h2>
      
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-gray-700 mb-2">Tipo de Movimiento:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            required
          >
            <option value="loan">Préstamo</option>
            <option value="return">Devolución</option>
          </select>
        </div>

        <div>
          <label htmlFor="userId" className="block text-gray-700 mb-2">Usuario:</label>
          {isLoadingUsers ? (
            <p className="text-gray-500">Cargando usuarios...</p>
          ) : errorUsers ? (
            <p className="text-red-500">{errorUsers}</p>
          ) : (
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-white"
              required
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="deviceId" className="block text-gray-700 mb-2">Dispositivo:</label>
          {isLoadingDevices ? (
            <p className="text-gray-500">Cargando dispositivos...</p>
          ) : errorDevices ? (
            <p className="text-red-500">{errorDevices}</p>
          ) : (
            <select
              id="deviceId"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-white"
              required
            >
              <option value="">Seleccione un dispositivo</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="loanDate" className="block text-gray-700 mb-2">
            {formData.type === "loan" ? "Fecha de Préstamo:" : "Fecha de Devolución:"}
          </label>
          <input
            type="date"
            id="loanDate"
            name="loanDate"
            value={formData.loanDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            required
          />
        </div>

        {formData.type === "loan" && (
          <div>
            <label htmlFor="returnDateExpected" className="block text-gray-700 mb-2">Fecha Esperada de Devolución:</label>
            <input
              type="date"
              id="returnDateExpected"
              name="returnDateExpected"
              value={formData.returnDateExpected}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-white"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            rows={4}
            placeholder="Ingrese una descripción detallada del movimiento"
            required
          ></textarea>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/movements`)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primaryColor hover:bg-primaryColorDark"
            } transition-colors duration-300`}
          >
            {isSubmitting ? "Guardando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}