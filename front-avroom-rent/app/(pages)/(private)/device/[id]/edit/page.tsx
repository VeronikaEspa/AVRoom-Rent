"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Device } from "@/app/utils/types/device.types";

export default function EditDevicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch(`/api/device/read?id=${id}`);
        if (!response.ok) {
          throw new Error("Error al cargar el dispositivo.");
        }
        const device = await response.json();
        setFormData(device);
      } catch (error) {
        console.error("Error fetching device:", error);
        setErrorMessage("No se pudo cargar el dispositivo.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDevice();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "checkbox"
                ? checked
                : type === "number"
                ? parseFloat(value) || 0 // Parse numeric inputs, fallback to 0
                : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/device/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los cambios.");
      }

      router.push(`/device/${id}`);
    } catch (error) {
      console.error("Error saving device:", error);
      setErrorMessage("No se pudo guardar el dispositivo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  if (!formData) {
    return <p className="text-red-500">{errorMessage || "Error al cargar el dispositivo."}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Editar Dispositivo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
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
          <label className="block text-gray-700 mb-2">Categoría:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Disponible:</label>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
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
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      </form>
    </div>
  );
}