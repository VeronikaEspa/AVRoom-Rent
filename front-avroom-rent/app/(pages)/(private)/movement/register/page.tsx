"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MovementFormData {
  deviceId: string;
  userId: string;
  loanDate: string;
  returnDateExpected: string;
}

export default function RegisterMovementPage() {
  const [formData, setFormData] = useState<MovementFormData>({
    deviceId: "",
    userId: "",
    loanDate: "",
    returnDateExpected: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(`/api/movement/user/${formData.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceId: formData.deviceId,
          loanDate: formData.loanDate,
          returnDateExpected: formData.returnDateExpected,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register movement.");
      }

      setSuccessMessage("Movimiento registrado exitosamente.");
      router.push(`/movements`); // Redirigir a la lista de movimientos
    } catch (error: any) {
      console.error("Error registering movement:", error);
      setErrorMessage(error.message || "Error al registrar el movimiento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Registrar Movimiento</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">ID del Dispositivo:</label>
          <input
            type="text"
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">ID del Usuario:</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Fecha de Préstamo:</label>
          <input
            type="date"
            name="loanDate"
            value={formData.loanDate}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Fecha Esperada de Devolución:
          </label>
          <input
            type="date"
            name="returnDateExpected"
            value={formData.returnDateExpected}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/movements`)}
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
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </form>
    </div>
  );
}
