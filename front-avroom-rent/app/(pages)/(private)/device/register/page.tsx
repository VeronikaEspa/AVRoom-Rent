"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Device } from "@/app/utils/types/device.types"

export default function RegisterDevicePage() {
  const [formData, setFormData] = useState<Omit<Device, "id">>({
    name: "",
    description: "",
    category: "",
    available: true,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, type } = target;
  
    let value: string | boolean;
  
    if (type === "checkbox" && target instanceof HTMLInputElement) {
      value = target.checked;
    } else {
      value = target.value;
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const token = getCookie("token");

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await axios.post(
        "/api/device/register",
        {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          available: formData.available,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Dispositivo registrado exitosamente.")
        router.push(`/device`);
      } else {
        throw new Error("Failed to register device.");
      }
    } catch (error: any) {
      console.error("Error registering device:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Error al registrar el dispositivo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Registrar Dispositivo</h2>
      
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            rows={4}
            placeholder="Ingrese una descripción detallada del dispositivo"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">Categoría:</label>
          <input
            type="text" 
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            placeholder="Ingrese la categoría del dispositivo"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="h-4 w-4 text-primaryColor border-gray-300 rounded"
          />
          <label htmlFor="available" className="ml-2 block text-gray-700">Disponible</label>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/devices`)}
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