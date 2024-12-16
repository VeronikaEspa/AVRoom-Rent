"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMovement } from "@/app/utils/types/movement.types";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

export default function RegisterReturnPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [devicesToReturn, setDevicesToReturn] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState<
    Omit<IMovement, "id" | "loanDate" | "returnDateExpected">
  >({
    userId: "",
    deviceId: "",
    description: "",
    returnDateActual: new Date(),
    loanStatus: "completed",
    type: "return",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwt.decode(token) as JwtPayload;
      const role = decoded.role.toLowerCase();

      if (role !== "student" && role !== "admin") {
        router.push("/");
        return;
      }

      setUserRole(role);
      setUserId(decoded.id);
    } catch (error) {
      console.error("Error decodificando JWT:", error);
      router.push("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (id && userId) {
      setFormData((prev) => ({
        ...prev,
        userId: userId
      }));
      // Obtenemos la lista de artículos a devolver
      const fetchDevices = async () => {
        try {
          const response = await fetch(`/api/movement/${userId}/get`);
          if (!response.ok) {
            throw new Error("Error al obtener los artículos.");
          }
          const data = await response.json();
          setDevicesToReturn(data);
        } catch (err) {
          console.error(err);
          setErrorMessage("No se pudo cargar la lista de artículos.");
        }
      };
      fetchDevices();
    }
  }, [id, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let value: string | boolean = e.target.value;
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      value = e.target.checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/movement/${userId}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar la devolución.");
      }

      router.push(`/device/${formData.deviceId}/details`);
    } catch (error) {
      console.error("Error registering return:", error);
      setErrorMessage("No se pudo registrar la devolución.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userRole === null) {
    return null;
  }

  const pageTitle = "Registrar Devolución";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-700 mb-6">{pageTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Artículo a devolver:</label>
          <select
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Seleccione un artículo</option>
            {devicesToReturn.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción de la devolución:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Fecha de Devolución Actual:</label>
          <input
            type="date"
            name="returnDateActual"
            value={(formData.returnDateActual as Date).toISOString().split("T")[0]}
            onChange={(e) => handleDateChange("returnDateActual", e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/`)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded ${
              isLoading ? "bg-gray-400" : "bg-primaryColor hover:bg-primaryColorDark"
            }`}
          >
            {isLoading ? "Guardando..." : "Registrar Devolución"}
          </button>
        </div>
        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      </form>
    </div>
  );
}