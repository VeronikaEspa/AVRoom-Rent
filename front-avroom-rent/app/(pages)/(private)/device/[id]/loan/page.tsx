"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMovement } from "@/app/utils/types/movement.types";
import { Role } from "@/app/utils/types/user.types";
import jwt from "jsonwebtoken"

interface JwtPayload {
  id: string;
  role: string;
}

export default function RegisterMovementPage() {
  const { id } = useParams();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    Omit<IMovement, "id" | "deviceId">
  >({
    userId: "",
    description: "",
    loanDate: new Date(),
    returnDateExpected: new Date(),
    loanStatus: "active",
    type: "loan",
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
        userId: userId,
        deviceId: id,
      }));
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
      const response = await fetch(`/api/movement/${id}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el movimiento.");
      }

      router.push(`/device/${id}/details`);
    } catch (error) {
      console.error("Error registering movement:", error);
      setErrorMessage("No se pudo registrar el movimiento.");
    } finally {
      setIsLoading(false);
    }
  };

  // Si aún no determinamos el rol, no renderizamos nada
  if (userRole === null) {
    return null;
  }

  const pageTitle = userRole === "admin" ? "Registrar Movimiento" : "Registrar Préstamo";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-700 mb-6">{pageTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {userRole === "ADMIN" && (
          <div>
            <label className="block text-gray-700 mb-2">Tipo de Movimiento:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="loan">Préstamo</option>
              <option value="return">Devolución</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">Descripción:</label>
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
          <label className="block text-gray-700 mb-2">Fecha de Préstamo:</label>
          <input
            type="date"
            name="loanDate"
            value={formData.loanDate.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange("loanDate", e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Fecha Esperada de Devolución:</label>
          <input
            type="date"
            name="returnDateExpected"
            value={formData.returnDateExpected.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange("returnDateExpected", e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/device/${id}`)}
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
            {isLoading ? "Guardando..." : "Registrar"}
          </button>
        </div>
        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      </form>
    </div>
  );
}